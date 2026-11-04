/* 2026-11-03: form Worker. Emails submissions to a verified inbox. Not wired into the site (MAX-1027). */
import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

const ALLOWED_ORIGINS = [
	"https://galactos.io",
	"http://localhost:5173",
	"http://localhost:8443",
];

export default {
	async fetch(request, env) {
		const origin = request.headers.get("Origin") || "";
		const cors = {
			"Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin)
				? origin
				: ALLOWED_ORIGINS[0],
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		};
		const reply = (obj, status = 200) =>
			new Response(JSON.stringify(obj), {
				status,
				headers: { ...cors, "Content-Type": "application/json" },
			});

		if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
		if (request.method !== "POST") return reply({ ok: false, error: "Method not allowed" }, 405);

		let data;
		try {
			const type = request.headers.get("Content-Type") || "";
			data = type.includes("application/json")
				? await request.json()
				: Object.fromEntries(await request.formData());
		} catch {
			return reply({ ok: false, error: "Bad request" }, 400);
		}

		const text = Object.entries(data)
			.map(([k, v]) => `${k}: ${String(v).slice(0, 2000)}`)
			.join("\n");
		if (!text) return reply({ ok: false, error: "Empty form" }, 400);

		const msg = createMimeMessage();
		msg.setSender({ name: "Galactos site", addr: "forms@galactos.io" });
		msg.setRecipient(env.DESTINATION);
		msg.setSubject("New galactos.io form submission");
		msg.addMessage({ contentType: "text/plain", data: text });

		try {
			await env.SEND_EMAIL.send(
				new EmailMessage("forms@galactos.io", env.DESTINATION, msg.asRaw())
			);
		} catch {
			return reply({ ok: false, error: "Could not send" }, 500);
		}
		return reply({ ok: true });
	},
};
