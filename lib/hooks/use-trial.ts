'use client';

import { useState, useEffect } from 'react';
import { differenceInDays, parseISO, addDays } from 'date-fns';

const TRIAL_DURATION_DAYS = 14;
const TRIAL_START_DATE_KEY = 'doorai_trial_start_date';

export function useTrial() {
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isTrialExpired, setIsTrialExpired] = useState<boolean>(false);
  const [isTrialEndingSoon, setIsTrialEndingSoon] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let storedStartDate = localStorage.getItem(TRIAL_START_DATE_KEY);
    let startDate: Date;

    if (storedStartDate) {
      startDate = parseISO(storedStartDate);
    } else {
      startDate = new Date();
      localStorage.setItem(TRIAL_START_DATE_KEY, startDate.toISOString());
    }
    setTrialStartDate(startDate);

    const updateTrialStatus = () => {
      const today = new Date();
      const trialEndDate = addDays(startDate, TRIAL_DURATION_DAYS);
      const remaining = differenceInDays(trialEndDate, today);

      setDaysRemaining(remaining);
      setIsTrialExpired(remaining <= 0);
      setIsTrialEndingSoon(remaining > 0 && remaining <= 3);
      setIsLoading(false);
    };

    updateTrialStatus(); // Initial calculation

    // Update status periodically
    const interval = setInterval(updateTrialStatus, 1000 * 60 * 60); // Check every hour

    return () => clearInterval(interval);
  }, []);

  return { trialStartDate, daysRemaining, isTrialExpired, isTrialEndingSoon, isLoading };
}