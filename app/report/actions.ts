"use server";

export type SubmitReportResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitMissingDogReport(
  formData: FormData
): Promise<SubmitReportResult> {

  const dogName = formData.get("dogName");

  if (!dogName) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: {
        dogName: ["Dog name is required."],
      },
    };
  }

  console.log("New missing dog report:", {
    dogName,
    breed: formData.get("breed"),
    description: formData.get("description"),
    location: formData.get("locationDescription"),
  });

  return {
    success: true,
    message: "Missing dog report submitted successfully!",
  };
}