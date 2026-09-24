import { describe,expect,it } from "vitest";
import { containsRestrictedSecret } from "@mow/core";

describe("adversarial secret detection",()=>{
  it("detects provider-like secrets",()=>{
    const key = ["s", "k-", "abcdefghijklmnopqrstuvwxyz123456"].join("");
    const privateKey = ["-----BEGIN RSA ", "PRIVATE KEY-----"].join("");
    expect(containsRestrictedSecret(`OPENROUTER=${key}`)).toBe(true);
    expect(containsRestrictedSecret(privateKey)).toBe(true);
  });
});
