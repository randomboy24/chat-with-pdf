import type { Request, Response } from "express";
import { Webhook } from "svix";
import * as userService from "../services/user.service.js"

type ClerkWebhookEvent = {
    type: "user.created" | "user.updated" | "user.deleted",
    data: any
}

export async function clerkWebhook(req: Request, res: Response) {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if(!secret) {
        console.error("CLERK_WEBHOOK_SECRET is not defined");
        return res.status(500).json({ error: "CLERK_WEBHOOK_SECRET is not defined" })
    }
    const payload = JSON.stringify(req.body)

    const svixId = req.header("svix-id");
    const svixTimestamp = req.header("svix-timestamp");
    const svixSignature = req.header("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        return res.status(400).send("Missing svix headers");
    }


    const headers = {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
    }

    const wh = new Webhook(secret)

    let evt;
    try {
        evt = wh.verify(payload, headers) as ClerkWebhookEvent
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Invalid webhook signature" })
    }

    const { type, data } = evt;

    switch (type) {
        case "user.created":
           const cleanUser:any = {
            _id: data.id,
            primary_email_address_id: data.primary_email_address_id,
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            image_url: data.image_url,
           }
           
           const primarEmail = data.email_addresses.find((email: any) => email.id === data.primary_email_address_id)
           cleanUser.email = primarEmail?.email_address
           const user = await userService.createUser(cleanUser)

            console.log("User created successfully:", user);
            break;
        case "user.updated":
            // const cleanUserUpdated = {
            //     id: user.id,
            //     primary_email_address_id: user.primary_email_address_id,
            //     first_name: user.first_name,
            //     last_name: user.last_name,
            //     username: user.username,
            //     image_url: user.image_url,
            // };

            // console.log(cleanUserUpdated);  
            break;
        case "user.deleted":
            // const cleanUserDeleted = {
            //     id: user.id,
            //     primary_email_address_id: user.primary_email_address_id,
            //     first_name: user.first_name,
            //     last_name: user.last_name,
            //     username: user.username,
            //     image_url: user.image_url,
            // };

            // console.log(cleanUserDeleted);
            break;
        default:
            console.log("Unknown event type:", type)
            break;
    }

    res.json({ ok:true })


}