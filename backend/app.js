import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Registration POST endpoint
app.post("/api/register", async (req, res) => {
    try {
        const { fullFormData, selectedMissions } = req.body;

        if (!selectedMissions || selectedMissions.length === 0) {
            return res.status(400).json({ error: "No events selected." });
        }

        const isSquad = fullFormData.isSquad;
        const teammates = fullFormData.teammates || [];

        let t2 = null, t3 = null, t4 = null, t5 = null;

        if (isSquad && teammates.length > 0) {
            t2 = teammates[0]?.email || null;
            t3 = teammates[1]?.email || null;
            t4 = teammates[2]?.email || null;
            t5 = teammates[3]?.email || null;
        }

        const collegeStr = fullFormData.college === 'Other Institution / University'
            ? (fullFormData.customCollege || 'Other College')
            : fullFormData.college;

        const currentSelectedEvents = selectedMissions.map((m) => m.title || m.id || "Unknown Event");
        const rollNo = fullFormData.pin || "UNKNOWN";

        // Check if the user is already registered via Roll No
        const { data: existingUser, error: fetchError } = await supabase
            .from("registrations")
            .select("event_names")
            .eq("team_lead_roll_no", rollNo)
            .maybeSingle();

        if (fetchError) {
            console.error("Fetch Error:", fetchError);
            return res.status(500).json({ error: "Database verification failed." });
        }

        let regData, regError;

        if (existingUser) {
            // User exists! Merge the events array and remove duplicates
            const existingEvents = existingUser.event_names || [];
            const mergedEvents = [...new Set([...existingEvents, ...currentSelectedEvents])];

            const result = await supabase
                .from("registrations")
                .update({ event_names: mergedEvents })
                .eq("team_lead_roll_no", rollNo)
                .select();

            regData = result.data;
            regError = result.error;
        } else {
            // New user registration!
            const result = await supabase
                .from("registrations")
                .insert([{
                    team_lead_roll_no: rollNo,
                    event_names: currentSelectedEvents,
                    flight_mode: isSquad ? "Squad" : "Solo",
                    team_lead_name: fullFormData.fullName || "Lead Participant",
                    team_lead_email: fullFormData.email,
                    team_lead_mobile: fullFormData.mobile,
                    college: collegeStr,
                    department: fullFormData.department || "N/A",
                    year_of_study: fullFormData.year || "1st Year",
                    team_member_email_2: t2,
                    team_member_email_3: t3,
                    team_member_email_4: t4,
                    team_member_email_5: t5
                }])
                .select();

            regData = result.data;
            regError = result.error;
        }

        if (regError) {
            console.error("Supabase Operation Error:", regError);
            return res.status(500).json({ error: "Failed to save registration.", details: regError.message });
        }

        return res.status(201).json({
            message: existingUser ? "Registration merged successfully!" : "Registration successful!",
            data: regData,
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: "Internal server error." });
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
    console.log(`Server is running on port ${PORT}.....`);
});