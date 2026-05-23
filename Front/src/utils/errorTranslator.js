export const traducirError = (error, t) => {

    if (!error) {
        return '';
    }

    if (typeof error === 'string') {
        return t(`ERRORS.${error}`);
    }

    return t(
        `ERRORS.${error.code}`,
        error.values
    );
};