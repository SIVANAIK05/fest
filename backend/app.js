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