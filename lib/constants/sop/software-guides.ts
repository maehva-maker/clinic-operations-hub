// lib/constants/sop/software-guides.ts
// The Software Academy's 7 guides. Unlike Workflow Guides, these are
// standalone content — there's no earlier phase to compose them from — so
// every field is authored here.

import type { SoftwareGuideArticle } from "@/types";

export const SOFTWARE_GUIDES: SoftwareGuideArticle[] = [
  {
    kind: "software_guide",
    id: "practiceq",
    title: "PracticeQ",
    whatIsIt:
      "The clinic's main EMR — patient charts, scheduling, and visit documentation all live here. Nearly every workflow starts or ends in PracticeQ.",
    whenToUseIt:
      "Anytime you're scheduling a visit, opening a patient's chart, or logging documentation for something you just did.",
    navigationSteps: [
      "Log in and land on the daily schedule view.",
      "Use the patient search bar (top of screen) to pull up a chart by name or DOB.",
      "Open the \"Appointments\" tab to schedule, reschedule, or check visit type.",
      "Open the \"Documents\" tab on a chart to attach labs, studies, or referral records.",
      "Use the \"Notes\" section to log an Activity Timeline-style entry directly on the chart.",
    ],
    requiredFields: ["Patient Name", "DOB", "Visit Type (when scheduling)"],
    commonMistakes: [
      "Searching by first name only, which returns too many results in a clinic this size — always search with DOB too.",
      "Booking the wrong visit type, which throws off the provider's whole schedule.",
    ],
    timeSavingTips: [
      "Pin frequently-used views (Today's Schedule, Open Referrals) so you don't re-navigate every time.",
    ],
    relatedWorkflowIds: ["scheduling", "chart_preparation", "new_weight_consult"],
    quickReference: {
      estimatedTime: "Used throughout the day",
      softwareNeeded: ["PracticeQ"],
      output: "An updated patient chart or schedule",
      difficulty: "beginner",
      relatedDocumentationTemplateId: null,
    },
  },
  {
    kind: "software_guide",
    id: "intakeq",
    title: "IntakeQ",
    whatIsIt:
      "The patient-facing forms and questionnaires platform — new patient intake, consent forms, and clinical questionnaires like the ESS.",
    whenToUseIt:
      "Before a new patient's first visit, or any time a provider needs a specific questionnaire (like the ESS for sleep patients) completed before the appointment.",
    navigationSteps: [
      "Open the patient's profile and select \"Send Intake Package.\"",
      "Choose the correct form set for the visit type (new patient, sleep questionnaire, weight management intake).",
      "Send via email or text — the patient completes it on their own device.",
      "Check the \"Pending\" tab to see who hasn't completed their forms yet.",
      "Once complete, forms sync automatically into the patient's PracticeQ chart.",
    ],
    requiredFields: ["Patient Name", "Email or Phone", "Form Set"],
    commonMistakes: [
      "Sending the wrong form set (e.g. general intake instead of the sleep-specific questionnaire).",
      "Not following up on pending forms before the visit, leaving the provider without them at check-in.",
    ],
    timeSavingTips: [
      "Send intake forms as soon as a new consult is booked, not the day before — patients need time to complete them.",
    ],
    relatedWorkflowIds: ["new_weight_consult", "referral", "roi_medical_records"],
    quickReference: {
      estimatedTime: "5 minutes to send, ongoing to track",
      softwareNeeded: ["IntakeQ"],
      output: "Completed patient forms synced to the chart",
      difficulty: "beginner",
      relatedDocumentationTemplateId: null,
    },
  },
  {
    kind: "software_guide",
    id: "availity",
    title: "Availity",
    whatIsIt:
      "The insurance eligibility and prior authorization portal — used to verify coverage and submit PA requests directly to payers.",
    whenToUseIt:
      "Before any visit or procedure that depends on insurance coverage, and any time a medication or study requires prior authorization.",
    navigationSteps: [
      "Log in and select \"Eligibility & Benefits\" to verify a patient's active coverage.",
      "Enter patient name, DOB, and insurance ID to pull up their plan details.",
      "For a PA, select \"Authorizations\" and choose the correct service/medication type.",
      "Submit required clinical documentation along with the request.",
      "Check \"Authorization Status\" periodically until it resolves.",
    ],
    requiredFields: ["Patient Name", "DOB", "Insurance ID", "Service/Medication Requested"],
    commonMistakes: [
      "Submitting a PA without attaching the required clinical documentation, causing an automatic denial.",
      "Not checking eligibility before a visit, leading to a surprise coverage issue at check-in.",
    ],
    timeSavingTips: [
      "Submit prior authorizations first thing in the morning — most payers' portals process fastest before midday traffic builds up.",
    ],
    relatedWorkflowIds: ["sleep_study", "pap_order", "prior_auth_glp1", "new_weight_consult"],
    quickReference: {
      estimatedTime: "10–20 minutes per request",
      softwareNeeded: ["Availity"],
      output: "Verified eligibility or a submitted prior authorization",
      difficulty: "intermediate",
      relatedDocumentationTemplateId: null,
    },
  },
  {
    kind: "software_guide",
    id: "labcorp",
    title: "LabCorp",
    whatIsIt:
      "The external lab ordering and results portal used to submit lab orders and retrieve results once processed.",
    whenToUseIt:
      "Any time a provider orders labs, and again when checking whether results have come back.",
    navigationSteps: [
      "Log in to the LabCorp ordering portal (separate credentials from PracticeQ).",
      "Enter the patient demographics and the specific test(s) ordered.",
      "Confirm the diagnosis code matches the test — mismatches delay processing.",
      "Submit the order and note the confirmation number.",
      "Check the \"Results\" tab a few days later, or set a follow-up reminder.",
    ],
    requiredFields: ["Patient Name", "DOB", "Test(s) Ordered", "Diagnosis Code"],
    commonMistakes: [
      "Mismatched diagnosis codes, which is the most common reason a lab order gets delayed or rejected.",
    ],
    timeSavingTips: [
      "Set a follow-up date the same day you submit the order so results are never forgotten.",
    ],
    relatedWorkflowIds: ["labcorp", "lab_monitoring"],
    quickReference: {
      estimatedTime: "10 minutes to order, 5 minutes to review",
      softwareNeeded: ["LabCorp"],
      output: "A submitted lab order or reviewed results",
      difficulty: "beginner",
      relatedDocumentationTemplateId: null,
    },
  },
  {
    kind: "software_guide",
    id: "dream_sleep_center",
    title: "Dream Sleep Center",
    whatIsIt:
      "The external sleep study facility's coordination portal — where sleep study orders are sent and confirmed.",
    whenToUseIt:
      "Any time a provider orders a home sleep test, in-lab PSG, or titration study.",
    navigationSteps: [
      "Fax or upload the signed sleep study order along with clinical notes.",
      "Note the date and time the order was sent — Dream Sleep Center doesn't always confirm same-day.",
      "Check back within 2 business days if you haven't heard confirmation.",
      "Once confirmed, coordinate scheduling directly with the patient.",
    ],
    requiredFields: ["Patient Name", "DOB", "Study Type", "Provider Order"],
    commonMistakes: [
      "Not following up when confirmation doesn't arrive within 2 business days — orders can sit unprocessed.",
    ],
    timeSavingTips: [
      "Batch-send the week's sleep study orders on Monday morning so follow-ups land predictably later in the week.",
    ],
    relatedWorkflowIds: ["sleep_study"],
    quickReference: {
      estimatedTime: "10 minutes to send, 2 business days to confirm",
      softwareNeeded: ["Dream Sleep Center"],
      output: "A confirmed sleep study order",
      difficulty: "beginner",
      relatedDocumentationTemplateId: null,
    },
  },
  {
    kind: "software_guide",
    id: "nlm",
    title: "NLM",
    whatIsIt:
      "The clinic's primary DME (durable medical equipment) supplier for PAP machines, masks, and related supplies.",
    whenToUseIt:
      "Any time a provider orders new PAP equipment, a replacement mask, or supply resupply for an existing PAP patient.",
    navigationSteps: [
      "Fax the signed equipment order with the specific device and mask type.",
      "Call or check NLM's supplier portal to confirm the fax was received.",
      "Note the fax confirmation number for the record.",
      "Follow up with the patient once NLM confirms shipment.",
    ],
    requiredFields: ["Patient Name", "DOB", "Equipment Ordered", "Insurance Authorization (if required)"],
    commonMistakes: [
      "Not confirming receipt of the fax — a silent fax is the most common reason equipment orders stall.",
    ],
    timeSavingTips: [
      "Keep NLM's direct order fax number in this guide instead of searching for it each time.",
    ],
    relatedWorkflowIds: ["pap_order"],
    quickReference: {
      estimatedTime: "10–15 minutes",
      softwareNeeded: ["NLM"],
      output: "A confirmed DME order",
      difficulty: "beginner",
      relatedDocumentationTemplateId: null,
    },
  },
  {
    kind: "software_guide",
    id: "microsoft_teams",
    title: "Microsoft Teams",
    whatIsIt:
      "Internal clinic communication and VoIP — messaging providers, joining calls, and coordinating on patient issues that need a quick internal answer.",
    whenToUseIt:
      "Any time you need a fast answer from a provider or teammate that doesn't need to wait for the next in-person huddle, or when placing/receiving clinic calls through the Teams phone system.",
    navigationSteps: [
      "Use \"Chat\" to message a specific provider or teammate directly.",
      "Use the patient's name in the message so context is immediately clear.",
      "Use \"Calls\" to place or receive patient calls routed through the clinic's Teams phone line.",
      "Use channel posts (not direct messages) for anything the whole team should see.",
    ],
    requiredFields: ["Recipient", "Context (patient name, if applicable)"],
    commonMistakes: [
      "Sending a patient-specific question to a general channel instead of the responsible provider directly.",
    ],
    timeSavingTips: [
      "Pin frequently-contacted providers to the top of your chat list.",
    ],
    relatedWorkflowIds: ["chart_preparation", "referral"],
    quickReference: {
      estimatedTime: "Used throughout the day",
      softwareNeeded: ["Microsoft Teams"],
      output: "A resolved internal question or a placed/received call",
      difficulty: "beginner",
      relatedDocumentationTemplateId: null,
    },
  },
];
