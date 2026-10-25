"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function loginAction(
  _prev: LoginResult | undefined,
  formData: FormData,
): Promise<LoginResult> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Usuario o contraseña incorrectos" };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
