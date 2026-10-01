const eventDateTime = (date, time) => new Date(`${date}T${time}:00+01:00`);

export function eventStepError(form, step) {
  if (step === 1) {
    if (!form.title.trim()) return { field: 'event-title', message: 'Enter an event title.' };
    if (!form.description.trim()) return { field: 'event-description', message: 'Enter a short event description.' };
  }
  if (step === 2) {
    if (!form.venue.trim()) return { field: 'event-venue', message: 'Enter the venue.' };
    if (!form.date) return { field: 'event-date', message: 'Choose the event date.' };
    if (!form.startTime) return { field: 'event-start-time', message: 'Choose the start time.' };
    if (!form.endDate) return { field: 'event-end-date', message: 'Choose the end date.' };
    if (!form.endTime) return { field: 'event-end-time', message: 'Choose the end time.' };
    if (!form.city.trim()) return { field: 'event-city', message: 'Enter the city.' };
    const start = eventDateTime(form.date, form.startTime);
    const end = eventDateTime(form.endDate, form.endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return { field: 'event-end-date', message: 'The end date and time must be after the start.' };
    }
  }
  if (step === 3) {
    if (form.price === '' || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      return { field: 'event-price', message: 'Enter a ticket price of ₦0 or more.' };
    }
    if (!Number.isInteger(Number(form.capacity)) || Number(form.capacity) < 1) {
      return { field: 'event-capacity', message: 'Enter a ticket capacity of at least 1.' };
    }
  }
  return null;
}

export function nextEndDate(startDate, currentEndDate) {
  return !currentEndDate || currentEndDate < startDate ? startDate : currentEndDate;
}
