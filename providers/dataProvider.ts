import type { DataProvider } from "@refinedev/core";

const API_URL = "/api";

// Helper to get tenant ID from context (will be implemented with auth)
const getTenantId = (): string => {
  // TODO: Get from auth context or session
  // For now, return a placeholder that will be replaced when auth is implemented
  return "demo-tenant";
};

// Helper to build query string from params
const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else if (typeof value === "object") {
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};

// Custom error class for API errors
class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

// Helper to handle API responses
const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status
    );
  }
  return response.json();
};

// Helper to get headers with tenant ID
const getHeaders = (): HeadersInit => {
  return {
    "Content-Type": "application/json",
    "X-Tenant-ID": getTenantId(),
  };
};

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters }) => {
    const { currentPage = 1, pageSize = 10 } = pagination ?? {};

    const queryParams: Record<string, unknown> = {
      _page: currentPage,
      _limit: pageSize,
    };

    // Handle sorting
    if (sorters && sorters.length > 0) {
      queryParams._sort = sorters.map((s) => s.field).join(",");
      queryParams._order = sorters.map((s) => s.order).join(",");
    }

    // Handle filters
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ("field" in filter && filter.field) {
          const { field, operator, value } = filter;

          // Special handling for general search "q" field
          if (field === "q") {
            queryParams.q = value;
            return;
          }

          switch (operator) {
            case "eq":
              queryParams[field] = value;
              break;
            case "ne":
              queryParams[`${field}_ne`] = value;
              break;
            case "lt":
              queryParams[`${field}_lt`] = value;
              break;
            case "gt":
              queryParams[`${field}_gt`] = value;
              break;
            case "lte":
              queryParams[`${field}_lte`] = value;
              break;
            case "gte":
              queryParams[`${field}_gte`] = value;
              break;
            case "contains":
              queryParams[`${field}_like`] = value;
              break;
            default:
              queryParams[field] = value;
          }
        }
      });
    }

    const queryString = buildQueryString(queryParams);
    const url = `${API_URL}/${resource}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    const result = await handleResponse(response);

    return {
      data: result.data,
      total: result.total,
    };
  },

  getOne: async ({ resource, id }) => {
    const url = `${API_URL}/${resource}/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    const result = await handleResponse(response);

    return {
      data: result.data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${API_URL}/${resource}`;

    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(variables),
    });

    const result = await handleResponse(response);

    return {
      data: result.data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${API_URL}/${resource}/${id}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(variables),
    });

    const result = await handleResponse(response);

    return {
      data: result.data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${API_URL}/${resource}/${id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const result = await handleResponse(response);

    return {
      data: result.data,
    };
  },

  getApiUrl: () => API_URL,

  // Optional methods
  getMany: async ({ resource, ids }) => {
    const queryString = buildQueryString({ id: ids });
    const url = `${API_URL}/${resource}?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    const result = await handleResponse(response);

    return {
      data: result.data,
    };
  },

  createMany: async ({ resource, variables }) => {
    const url = `${API_URL}/${resource}/bulk`;

    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ data: variables }),
    });

    const result = await handleResponse(response);

    return {
      data: result.data,
    };
  },

  deleteMany: async ({ resource, ids }) => {
    const url = `${API_URL}/${resource}/bulk`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ ids }),
    });

    const result = await handleResponse(response);

    return {
      data: result.data,
    };
  },

  updateMany: async ({ resource, ids, variables }) => {
    const url = `${API_URL}/${resource}/bulk`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ ids, data: variables }),
    });

    const result = await handleResponse(response);

    return {
      data: result.data,
    };
  },

  custom: async ({ url, method, payload, headers: customHeaders }) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: method.toUpperCase(),
      headers: {
        ...getHeaders(),
        ...customHeaders,
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    const result = await handleResponse(response);

    return {
      data: result,
    };
  },
};
