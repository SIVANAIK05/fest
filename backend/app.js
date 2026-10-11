import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic Root & Health Check Endpoints
app.get("/", (req, res) => {
    res.json({
        status: "online",
        name: "Astrion Fest 2026 API",
        message: "Backend server is running and connected to Supabase."
    });
});

app.get("/api/health", async (req, res) => {
    try {
        const { error } = await supabase.from("registrations").select("team_lead_roll_no").limit(1);
        if (error) {
            return res.status(500).json({ status: "degraded", error: error.message });
        }
        return res.json({ status: "healthy", database: "connected", timestamp: new Date().toISOString() });
    } catch (err) {
        return res.status(500).json({ status: "error", error: err.message });
    }
});

// Helper to format teammate info
const formatTeammate = (t) => {
    if (!t) return null;
    if (typeof t === "string") return t.trim() || null;
    const email = (t.email || "").trim();
    const name = (t.name || "").trim();
    const mobile = (t.mobile || "").trim();
    if (email) return email;
    if (name && mobile) return `${name} (${mobile})`;
    if (name) return name;
    if (mobile) return mobile;
    return null;
};

// Registration POST endpoint
app.post("/api/register", async (req, res) => {
    try {
        const body = req.body || {};
        // Support both nested payload from modal and flat payload
        const formData = body.fullFormData || body.formData || body.rawFormData || body;
        const rawMissions = body.selectedMissions || body.events || body.selectedEvents || [];
        const missions = Array.isArray(rawMissions) ? rawMissions : [rawMissions];

        if (missions.length === 0) {
            return res.status(400).json({ error: "No events selected. Please select at least one mission." });
        }

        const currentSelectedEvents = missions
            .map((m) => {
                if (typeof m === "string") return m.trim();
                return (m?.title || m?.name || m?.id || "").trim();
            })
            .filter(Boolean);

        if (currentSelectedEvents.length === 0) {
            return res.status(400).json({ error: "Selected events could not be verified." });
        }

        const rawRollNo = formData.pin || formData.team_lead_roll_no || formData.rollNo || formData.studentId;
        if (!rawRollNo || typeof rawRollNo !== "string" || !rawRollNo.trim()) {
            return res.status(400).json({ error: "Student Roll No / PIN is required for registration." });
        }
        const rollNo = rawRollNo.trim().toUpperCase();

        const isSquad = Boolean(
            formData.isSquad || 
            formData.flight_mode === "Squad" || 
            formData.flight_mode === "Squadron / Team" ||
            formData.teamName
        );

        const teammates = Array.isArray(formData.teammates) ? formData.teammates : [];
        let t2 = null, t3 = null, t4 = null, t5 = null;

        if (isSquad && teammates.length > 0) {
            t2 = formatTeammate(teammates[0]);
            t3 = formatTeammate(teammates[1]);
            t4 = formatTeammate(teammates[2]);
            t5 = formatTeammate(teammates[3]);
        }
        // Fallbacks for direct fields
        t2 = t2 || formData.team_member_email_2 || null;
        t3 = t3 || formData.team_member_email_3 || null;
        t4 = t4 || formData.team_member_email_4 || null;
        t5 = t5 || formData.team_member_email_5 || null;

        const collegeStr = formData.college === "Other Institution / University"
            ? (formData.customCollege?.trim() || "Other College")
            : (formData.college?.trim() || formData.institution?.trim() || "S.R.K.R. Engineering College");

        // Check if user is already registered via Roll No
        const { data: existingUser, error: fetchError } = await supabase
            .from("registrations")
            .select("*")
            .eq("team_lead_roll_no", rollNo)
            .maybeSingle();

        if (fetchError) {
            console.error("Supabase Verification Error:", fetchError);
            return res.status(500).json({ error: "Database verification failed.", details: fetchError.message });
        }

        let regData, regError;

        if (existingUser) {
            // Merge events array and remove duplicates
            const existingEvents = Array.isArray(existingUser.event_names) ? existingUser.event_names : [];
            const mergedEvents = [...new Set([...existingEvents, ...currentSelectedEvents])];

            const updatePayload = {
                event_names: mergedEvents,
                flight_mode: isSquad ? "Squad" : (existingUser.flight_mode || "Solo"),
                team_lead_name: formData.fullName?.trim() || formData.team_lead_name?.trim() || existingUser.team_lead_name,
                team_lead_email: formData.email?.trim() || formData.team_lead_email?.trim() || existingUser.team_lead_email,
                team_lead_mobile: formData.mobile?.trim() || formData.team_lead_mobile?.trim() || existingUser.team_lead_mobile,
                college: collegeStr || existingUser.college,
                department: formData.department?.trim() || existingUser.department,
                year_of_study: formData.year?.trim() || formData.year_of_study?.trim() || existingUser.year_of_study,
                team_member_email_2: t2 || existingUser.team_member_email_2,
                team_member_email_3: t3 || existingUser.team_member_email_3,
                team_member_email_4: t4 || existingUser.team_member_email_4,
                team_member_email_5: t5 || existingUser.team_member_email_5
            };

            const result = await supabase
                .from("registrations")
                .update(updatePayload)
                .eq("team_lead_roll_no", rollNo)
                .select();

            regData = result.data;
            regError = result.error;
        } else {
            // New user registration
            const insertPayload = {
                team_lead_roll_no: rollNo,
                event_names: currentSelectedEvents,
                flight_mode: isSquad ? "Squad" : "Solo",
                team_lead_name: formData.fullName?.trim() || formData.team_lead_name?.trim() || "Lead Commander",
                team_lead_email: formData.email?.trim() || formData.team_lead_email?.trim() || null,
                team_lead_mobile: formData.mobile?.trim() || formData.team_lead_mobile?.trim() || null,
                college: collegeStr,
                department: formData.department?.trim() || "N/A",
                year_of_study: formData.year?.trim() || formData.year_of_study?.trim() || "1st Year",
                team_member_email_2: t2,
                team_member_email_3: t3,
                team_member_email_4: t4,
                team_member_email_5: t5
            };

            const result = await supabase
                .from("registrations")
                .insert([insertPayload])
                .select();

            regData = result.data;
            regError = result.error;
        }

        if (regError) {
            console.error("Supabase Save Error:", regError);
            return res.status(500).json({ error: "Failed to save registration.", details: regError.message });
        }

        return res.status(201).json({
            success: true,
            message: existingUser ? "Registration merged with existing pass!" : "Registration registered successfully!",
            data: regData,
        });
    } catch (error) {
        console.error("Server Registration Error:", error);
        return res.status(500).json({ error: "Internal server error.", details: error.message });
    }
});

// Verification check endpoint by roll number
app.get("/api/registration/:rollNo", async (req, res) => {
    try {
        const rollNo = (req.params.rollNo || "").trim().toUpperCase();
        if (!rollNo) {
            return res.status(400).json({ error: "Roll number required." });
        }

        const { data, error } = await supabase
            .from("registrations")
            .select("*")
            .eq("team_lead_roll_no", rollNo)
            .maybeSingle();

        if (error) {
            return res.status(500).json({ error: "Database error.", details: error.message });
        }
        if (!data) {
            return res.status(404).json({ error: "Registration not found." });
        }

        return res.json({ success: true, registration: data });
    } catch (err) {
        return res.status(500).json({ error: "Internal error.", details: err.message });
    }
});

// Mission Intelligence & Registration Telemetry Reports endpoint
app.get("/api/reports", async (req, res) => {
    try {
        const { data: registrations, error } = await supabase
            .from("registrations")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase Reports Error:", error);
            return res.status(500).json({ error: "Failed to fetch reports from database.", details: error.message });
        }

        const list = registrations || [];
        const totalRegistrations = list.length;
        let soloCount = 0;
        let squadCount = 0;
        let totalAstronauts = 0;
        const eventBreakdown = {};
        const collegeBreakdown = {};

        list.forEach((reg) => {
            const isSquad = reg.flight_mode === "Squad" || reg.flight_mode === "Squadron / Team";
            if (isSquad) {
                squadCount++;
                // Count team members if present
                let membersCount = 1; // lead
                if (reg.team_member_email_2) membersCount++;
                if (reg.team_member_email_3) membersCount++;
                if (reg.team_member_email_4) membersCount++;
                if (reg.team_member_email_5) membersCount++;
                totalAstronauts += membersCount;
            } else {
                soloCount++;
                totalAstronauts += 1;
            }

            // Count events
            const events = Array.isArray(reg.event_names) ? reg.event_names : [];
            events.forEach((ev) => {
                const name = typeof ev === 'string' ? ev.trim() : (ev?.title || ev?.name || 'Mission');
                if (name) {
                    eventBreakdown[name] = (eventBreakdown[name] || 0) + 1;
                }
            });

            // Count college
            const col = (reg.college || "Unspecified").trim();
            collegeBreakdown[col] = (collegeBreakdown[col] || 0) + 1;
        });

        return res.json({
            success: true,
            timestamp: new Date().toISOString(),
            metrics: {
                totalRegistrations,
                totalAstronauts,
                soloSquadRatio: { solo: soloCount, squad: squadCount },
                uniqueColleges: Object.keys(collegeBreakdown).length,
                uniqueEvents: Object.keys(eventBreakdown).length
            },
            eventBreakdown,
            collegeBreakdown,
            registrations: list
        });
    } catch (err) {
        console.error("Reports API error:", err);
        return res.status(500).json({ error: "Internal server error.", details: err.message });
    }
});

// CSV Export for Registration Flight Manifest Report
app.get("/api/reports/export", async (req, res) => {
    try {
        const { data: registrations, error } = await supabase
            .from("registrations")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).send("Database error generating CSV: " + error.message);
        }

        const list = registrations || [];
        const headers = [
            "Roll No / PIN",
            "Commander Name",
            "Email",
            "Mobile",
            "College",
            "Department",
            "Year",
            "Flight Mode",
            "Teammates",
            "Registered Events",
            "Created At"
        ];

        const escapeCsv = (str) => {
            if (str === null || str === undefined) return '""';
            const val = String(str).replace(/"/g, '""');
            return `"${val}"`;
        };

        const rows = list.map((r) => {
            const teammates = [
                r.team_member_email_2,
                r.team_member_email_3,
                r.team_member_email_4,
                r.team_member_email_5
            ].filter(Boolean).join(" | ");

            const events = Array.isArray(r.event_names) ? r.event_names.join(", ") : (r.event_names || "");

            return [
                escapeCsv(r.team_lead_roll_no),
                escapeCsv(r.team_lead_name),
                escapeCsv(r.team_lead_email),
                escapeCsv(r.team_lead_mobile),
                escapeCsv(r.college),
                escapeCsv(r.department),
                escapeCsv(r.year_of_study),
                escapeCsv(r.flight_mode),
                escapeCsv(teammates),
                escapeCsv(events),
                escapeCsv(r.created_at)
            ].join(",");
        });

        const csvContent = [headers.join(","), ...rows].join("\r\n");

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="astrion_2026_flight_manifest.csv"');
        return res.send(csvContent);
    } catch (err) {
        return res.status(500).send("Error generating export: " + err.message);
    }
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, contact, department, message } = req.body;

        const { error } = await supabase
            .from('contact_messages')
            .insert([{ name, contact, department, message }]);

        if (error) {
            console.error('Contact Message Error:', error);
            return res.status(500).json({ error: "Failed to save message." });
        }

        return res.status(201).json({ message: "Message received successfully!" });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

app.listen(PORT, () => {
    console.log(`Astrion Fest backend running on port ${PORT}...`);
});