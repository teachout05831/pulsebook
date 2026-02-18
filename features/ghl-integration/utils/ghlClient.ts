import type {
  GhlCreateContactPayload,
  GhlUpdateContactPayload,
  GhlContactResponse,
} from "../types";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

interface CreateContactInput {
  apiToken: string;
  locationId: string;
  customerName: string;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  tags?: string[];
}

interface UpdateContactInput {
  apiToken: string;
  ghlContactId: string;
  customerName?: string;
  email?: string | null;
  phone?: string | null;
  tags?: string[];
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

export async function syncContactToGhl(
  input: CreateContactInput
): Promise<string | null> {
  try {
    const { firstName, lastName } = splitName(input.customerName);

    const payload: GhlCreateContactPayload = {
      firstName,
      lastName,
      locationId: input.locationId,
      ...(input.email && { email: input.email }),
      ...(input.phone && { phone: input.phone }),
      ...(input.source && { source: input.source }),
      ...(input.tags?.length && { tags: input.tags }),
    };

    const res = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.apiToken}`,
        "Content-Type": "application/json",
        Version: GHL_API_VERSION,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(`GHL create contact failed: ${res.status}`);
      return null;
    }

    const data: GhlContactResponse = await res.json();
    return data.contact?.id || null;
  } catch (err) {
    console.error("GHL create contact error:", err);
    return null;
  }
}

export async function updateGhlContact(
  input: UpdateContactInput
): Promise<boolean> {
  try {
    const payload: GhlUpdateContactPayload = {};

    if (input.customerName) {
      const { firstName, lastName } = splitName(input.customerName);
      payload.firstName = firstName;
      payload.lastName = lastName;
    }
    if (input.email) payload.email = input.email;
    if (input.phone) payload.phone = input.phone;
    if (input.tags?.length) payload.tags = input.tags;

    const res = await fetch(
      `${GHL_API_BASE}/contacts/${input.ghlContactId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${input.apiToken}`,
          "Content-Type": "application/json",
          Version: GHL_API_VERSION,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      console.error(`GHL update contact failed: ${res.status}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("GHL update contact error:", err);
    return false;
  }
}
