import axios from "axios";
import type { AxiosRequestHeaders, Method, AxiosResponse } from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = async <T = any>(
  method: Method,
  url: string,
  bodyData?: any,
  headers?: AxiosRequestHeaders,
  params?: Record<string, any>
): Promise<AxiosResponse<T>> => {
  return axiosInstance({
    method,
    url,
    data: bodyData ?? null,
    headers: headers ?? undefined,
    params: params ?? undefined,
  });
};