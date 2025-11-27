// hooks/useAutoSave.ts
import {useCallback, useEffect, useRef, useState} from "react";
import {saveOnboardingProgress} from "../services/onboardingService";

export function useAutoSave(formData: any, currentStep: number) {
    const [autoSaving, setAutoSaving] = useState(false);
    const [progressSaved, setProgressSaved] = useState(false);
    const [savingProgress, setSavingProgress] = useState(false);

    const autoSaveTimeoutRef = useRef<any>(null);
    const lastSavedDataRef = useRef<any>({});

    const hasFormDataChanged = useCallback(() => {
        // Do not auto-save on the welcome step (step 0)
        if (currentStep === 0) return false;

        const currentKeys = Object.keys(formData || {});
        const savedKeys = Object.keys(lastSavedDataRef.current || {});

        if (currentKeys.length !== savedKeys.length) return true;

        return currentKeys.some(
            (key) => formData[key] !== lastSavedDataRef.current[key]
        );
    }, [formData, currentStep]);

    const autoSaveFormData = useCallback(async () => {
        if (!hasFormDataChanged()) return;

        setAutoSaving(true);
        try {
            // Include the currentStep so we can restore where the user left off
            const payload = {...formData, currentStep};
            const result = await saveOnboardingProgress(payload);

            if (result) {
                lastSavedDataRef.current = {...formData};
                // also store currentStep locally so detection is consistent
                lastSavedDataRef.current.currentStep = currentStep;
                setProgressSaved(true);
                setTimeout(() => setProgressSaved(false), 3000);
            }
        } catch (error) {
            console.error("Error auto-saving progress:", error);
        } finally {
            setAutoSaving(false);
        }
    }, [formData, currentStep, hasFormDataChanged]);

    const saveProgress = useCallback(async () => {
        if (!formData || Object.keys(formData).length === 0) return;

        setSavingProgress(true);
        try {
            await autoSaveFormData();
        } finally {
            setSavingProgress(false);
        }
    }, [formData, autoSaveFormData]);

    // Auto-save effect
    useEffect(() => {
        if (formData && Object.keys(formData).length > 0 && hasFormDataChanged()) {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }

            autoSaveTimeoutRef.current = setTimeout(autoSaveFormData, 2000) as any;
        }

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
        // we intentionally include currentStep so autosave runs when step changes
    }, [formData, currentStep, hasFormDataChanged, autoSaveFormData]);

    return {
        autoSaving,
        progressSaved,
        savingProgress,
        saveProgress,
    };
}
