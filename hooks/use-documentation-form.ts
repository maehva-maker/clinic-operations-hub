"use client";

// hooks/use-documentation-form.ts
// Orchestrates the Clinical Documentation generator: template selection,
// the universal + template-specific field state, live validation, the live
// EMR preview text, and saving. All text generation and validation logic
// lives in services/documentation.service.ts — this hook only wires that
// service to React state, per the "business logic belongs in services" rule.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DOCUMENTATION_TEMPLATES,
  getTemplateById,
} from "@/lib/constants/documentation-templates";
import {
  buildEmrNote,
  saveDocumentationEntry,
  validateDocumentationForm,
  type SaveDocumentationInput,
} from "@/services/documentation.service";
import { getOpenLoops } from "@/services/open-loops.service";
import { getTodayIso } from "@/lib/utils/date";
import type {
  DocFieldValues,
  DocumentationCategory,
  DocumentationCommonFields,
  DocumentationEntry,
  DocumentationTemplateId,
  OpenLoop,
} from "@/types";

function currentTimeHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function buildDefaultCommonFields(patientName = ""): DocumentationCommonFields {
  return {
    patientName,
    action: "",
    outcome: "",
    date: getTodayIso(),
    time: currentTimeHHMM(),
    performer: "Mae",
    additionalNote: "",
  };
}

interface UseDocumentationFormResult {
  categoryFilter: DocumentationCategory | "all";
  setCategoryFilter: (category: DocumentationCategory | "all") => void;
  templateSearch: string;
  setTemplateSearch: (value: string) => void;
  filteredTemplates: typeof DOCUMENTATION_TEMPLATES;
  selectedTemplateId: DocumentationTemplateId;
  selectTemplate: (id: DocumentationTemplateId) => void;
  common: DocumentationCommonFields;
  updateCommon: (patch: Partial<DocumentationCommonFields>) => void;
  fieldValues: DocFieldValues;
  updateField: (key: string, value: string) => void;
  relatedOpenLoopId: string | null;
  setRelatedOpenLoopId: (id: string | null) => void;
  openLoopOptions: OpenLoop[];
  previewText: string;
  isValid: boolean;
  missingFieldLabels: string[];
  isSaving: boolean;
  save: () => Promise<DocumentationEntry | null>;
  resetForm: () => void;
}

const DEFAULT_TEMPLATE_ID: DocumentationTemplateId = "appointment_confirmation";

/**
 * `initialTemplateId` lets another module (e.g. a Workflow Guide's "Open in
 * Clinical Documentation" button) deep-link straight to the right template
 * instead of always landing on the default. `initialPatientName` similarly
 * lets the Patient Directory's "Document" quick action prefill the patient
 * name field.
 */
export function useDocumentationForm(
  initialTemplateId?: DocumentationTemplateId,
  initialPatientName?: string,
): UseDocumentationFormResult {
  const [categoryFilter, setCategoryFilter] = useState<DocumentationCategory | "all">("all");
  const [templateSearch, setTemplateSearch] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<DocumentationTemplateId>(initialTemplateId ?? DEFAULT_TEMPLATE_ID);
  const [common, setCommon] = useState<DocumentationCommonFields>(() =>
    buildDefaultCommonFields(initialPatientName),
  );
  const [fieldValues, setFieldValues] = useState<DocFieldValues>({});
  const [relatedOpenLoopId, setRelatedOpenLoopId] = useState<string | null>(null);
  const [openLoopOptions, setOpenLoopOptions] = useState<OpenLoop[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    void getOpenLoops().then((loops) => {
      if (isMounted) setOpenLoopOptions(loops);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTemplates = useMemo(() => {
    const query = templateSearch.trim().toLowerCase();
    return DOCUMENTATION_TEMPLATES.filter((template) => {
      if (categoryFilter !== "all" && template.category !== categoryFilter) return false;
      if (query && !template.label.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [categoryFilter, templateSearch]);

  const selectTemplate = useCallback((id: DocumentationTemplateId) => {
    setSelectedTemplateId(id);
    setFieldValues({});
  }, []);

  const updateCommon = useCallback((patch: Partial<DocumentationCommonFields>) => {
    setCommon((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateField = useCallback((key: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const template = useMemo(() => getTemplateById(selectedTemplateId), [selectedTemplateId]);

  const previewText = useMemo(
    () => buildEmrNote(template, common, fieldValues),
    [template, common, fieldValues],
  );

  const { isValid, missingFieldLabels } = useMemo(
    () => validateDocumentationForm(template, common, fieldValues),
    [template, common, fieldValues],
  );

  const resetForm = useCallback(() => {
    setCommon(buildDefaultCommonFields());
    setFieldValues({});
    setRelatedOpenLoopId(null);
  }, []);

  const save = useCallback(async () => {
    if (!isValid) return null;

    setIsSaving(true);
    try {
      const input: SaveDocumentationInput = {
        templateId: template.id,
        category: template.category,
        common,
        fieldValues,
        noteText: previewText,
        relatedOpenLoopId,
      };
      const entry = await saveDocumentationEntry(input);
      resetForm();
      return entry;
    } finally {
      setIsSaving(false);
    }
  }, [isValid, template, common, fieldValues, previewText, relatedOpenLoopId, resetForm]);

  return {
    categoryFilter,
    setCategoryFilter,
    templateSearch,
    setTemplateSearch,
    filteredTemplates,
    selectedTemplateId,
    selectTemplate,
    common,
    updateCommon,
    fieldValues,
    updateField,
    relatedOpenLoopId,
    setRelatedOpenLoopId,
    openLoopOptions,
    previewText,
    isValid,
    missingFieldLabels,
    isSaving,
    save,
    resetForm,
  };
}
