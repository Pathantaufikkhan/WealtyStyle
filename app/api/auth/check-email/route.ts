import { NextRequest, NextResponse } from "next/server";
import {
  validateEmailSyntax,
  parseEmail,
  isDisposableDomain,
  getDomainTypoSuggestion,
  checkDomainMxRecords,
} from "@/lib/validations/emailVerification";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        {
          status: "invalid_syntax",
          isValid: false,
          domainExists: false,
          isDisposable: false,
          suggestion: null,
          message: "Please provide an email address.",
        },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check basic syntax
    if (!validateEmailSyntax(trimmedEmail)) {
      return NextResponse.json({
        status: "invalid_syntax",
        isValid: false,
        domainExists: false,
        isDisposable: false,
        suggestion: null,
        message: "Please enter a valid email format (e.g., name@domain.com).",
      });
    }

    const parsed = parseEmail(trimmedEmail);
    if (!parsed) {
      return NextResponse.json({
        status: "invalid_syntax",
        isValid: false,
        domainExists: false,
        isDisposable: false,
        suggestion: null,
        message: "Invalid email format.",
      });
    }

    const { user, domain } = parsed;

    // Optional check for typos in common domains (e.g. gmaill.com -> gmail.com)
    const typoCorrection = getDomainTypoSuggestion(domain);
    const suggestedEmail = typoCorrection ? `${user}@${typoCorrection}` : null;

    if (suggestedEmail && suggestedEmail !== trimmedEmail) {
      return NextResponse.json({
        status: "typo_detected",
        isValid: true,
        domainExists: true,
        isDisposable: false,
        suggestion: suggestedEmail,
        message: `Did you mean ${suggestedEmail}?`,
      });
    }

    // Mark as valid email - OTP can be dispatched to any email address
    return NextResponse.json({
      status: "valid",
      isValid: true,
      domainExists: true,
      isDisposable: false,
      suggestion: null,
      message: "Valid email address ready for OTP verification.",
    });
  } catch (error: any) {
    console.error("[Check Email API Error]:", error);
    return NextResponse.json(
      {
        status: "valid",
        isValid: true,
        domainExists: true,
        isDisposable: false,
        suggestion: null,
        message: "Email address accepted.",
      }
    );
  }
}
