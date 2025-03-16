export const getMinutesAgo = (isoString: string): number => {
    const pastDate = new Date(isoString);
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - pastDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);

    return diffInMinutes;
};
