export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelayMs: number = 100,
    maxDelayMs: number = 5000
): Promise<T> {
    let lastError: Error | null = null;
    let attempt = 0;

    const isRetryableError = (error: any): boolean => {
        // List of transient error codes (PostgreSQL error codes)
        const transientErrorCodes = [
            '40P01', // deadlock_detected
            '55P03', // lock_not_available
            '57014', // query_canceled
            '57P01', // admin_shutdown
            '57P02', // crash_shutdown
            '57P03', // cannot_connect_now
            '58000', // system_error
            '58030', // io_error
            'XX000'  // internal_error
        ];

        // Check if error is a database error with a retryable code
        if (error.code && transientErrorCodes.includes(error.code)) {
            return true;
        }

        // Check for network-related errors
        if (error.name === 'QueryFailedError' || 
            error.name === 'ConnectionError' ||
            error.name === 'ConnectionTimedOutError' ||
            error.name === 'TimeoutError' ||
            error.name === 'SequelizeConnectionError') {
            return true;
        }

        return false;
    };

    const calculateDelay = (attempt: number): number => {
        // Exponential backoff with jitter
        const backoff = Math.min(initialDelayMs * Math.pow(2, attempt), maxDelayMs);
        return Math.floor(backoff / 2 + Math.random() * backoff / 2);
    };

    while (attempt < maxRetries) {
        try {
            return await operation();
        } catch (error: any) {
            lastError = error;
            
            if (!isRetryableError(error) || attempt === maxRetries - 1) {
                break;
            }

            const delay = calculateDelay(attempt);
            console.warn(`Retryable error (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms:`, error.message);
            
            await new Promise(resolve => setTimeout(resolve, delay));
            attempt++;
        }
    }

    // If we get here, all retries failed
    throw lastError || new Error('Operation failed after maximum retries');
}
