export interface PaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export class ApiResponse<T> {
    static success<T>(message: string, data: T, meta?: PaginationMeta) {
        return {
            success: true,
            message,
            data,
            ...(meta && { meta }),
            timestamp: new Date().toISOString(),
        };
    }

    static error(message: string, error: any = null, statusCode = 400) {
        return {
            success: false,
            message,
            error,
            statusCode,
            timestamp: new Date().toISOString(),
        };
    }
}