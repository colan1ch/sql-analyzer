/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApitypesIndexJSON {
  description?: string;
  id?: number;
  image?: string;
  is_delete?: boolean;
  name?: string;
}

export interface ApitypesIndexesQueryJSON {
  cardinality?: number;
  id?: number;
  index_id?: number;
  query_id?: number;
  recieved_rows?: number;
  rows_count?: number;
  table_field?: string;
}

export interface ApitypesQueryJSON {
  creator_login?: string;
  date_create?: string;
  date_finish?: string;
  date_form?: string;
  date_query?: string;
  execution_time?: number;
  id?: number;
  moderator_login?: string;
  status?: string;
}

export interface ApitypesStatusJSON {
  status?: string;
}

export interface ApitypesUserJSON {
  id?: string;
  is_moderator?: boolean;
  login?: string;
  password?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "//127.0.0.1:8080/api/v1",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Query Execution Time Calculation API
 * @version 1.0
 * @baseUrl //127.0.0.1:8080/api/v1
 * @contact
 *
 * API для вычисления времени выполнения SQL-запросов
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  indexes = {
    /**
     * @description Возвращает все индексы или фильтрует по названию
     *
     * @tags indexes
     * @name IndexesList
     * @summary Получить список индексов
     * @request GET:/indexes
     */
    indexesList: (
      query?: {
        /** Название индекса для поиска */
        index_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApitypesIndexJSON[], Record<string, string>>({
        path: `/indexes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новый индекс и возвращает его данные
     *
     * @tags indexes
     * @name CreateIndexCreate
     * @summary Создать новый индекс
     * @request POST:/indexes/create-index
     * @secure
     */
    createIndexCreate: (index: ApitypesIndexJSON, params: RequestParams = {}) =>
      this.request<ApitypesIndexJSON, Record<string, string>>({
        path: `/indexes/create-index`,
        method: "POST",
        body: index,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию об индексе по её идентификатору
     *
     * @tags indexes
     * @name IndexesDetail
     * @summary Получить индекс по ID
     * @request GET:/indexes/{id}
     */
    indexesDetail: (id: number, params: RequestParams = {}) =>
      this.request<ApitypesIndexJSON, Record<string, string>>({
        path: `/indexes/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет индекс в черновик запроса пользователя
     *
     * @tags indexes
     * @name AddToQueryCreate
     * @summary Добавить индекс в запрос
     * @request POST:/indexes/{id}/add-to-query
     * @secure
     */
    addToQueryCreate: (id: number, params: RequestParams = {}) =>
      this.request<ApitypesQueryJSON, Record<string, string>>({
        path: `/indexes/${id}/add-to-query`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет информацию об индексе по ID
     *
     * @tags indexes
     * @name ChangeIndexUpdate
     * @summary Изменить данные индекса
     * @request PUT:/indexes/{id}/change-index
     * @secure
     */
    changeIndexUpdate: (
      id: number,
      index: ApitypesIndexJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesIndexJSON, Record<string, string>>({
        path: `/indexes/${id}/change-index`,
        method: "PUT",
        body: index,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Загружает изображение для индекса и возвращает обновленные данные
     *
     * @tags indexes
     * @name CreateImageCreate
     * @summary Загрузить изображение для индекса
     * @request POST:/indexes/{id}/create-image
     * @secure
     */
    createImageCreate: (
      id: number,
      data: {
        /** Изображение индекса */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/indexes/${id}/create-image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет логическое удаление индекса по ID
     *
     * @tags indexes
     * @name DeleteIndexDelete
     * @summary Удалить индекс
     * @request DELETE:/indexes/{id}/delete-index
     * @secure
     */
    deleteIndexDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/indexes/${id}/delete-index`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  indexesQuery = {
    /**
     * @description Обновляет параметры индекса в конкретном запросе
     *
     * @tags indexes-query
     * @name IndexesQueryUpdate
     * @summary Изменить данные индекса в запросе
     * @request PUT:/indexes_query/{index_id}/{query_id}
     * @secure
     */
    indexesQueryUpdate: (
      indexId: number,
      queryId: number,
      data: ApitypesIndexesQueryJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesIndexesQueryJSON, Record<string, string>>({
        path: `/indexes_query/${indexId}/${queryId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет связь индекса и запроса
     *
     * @tags indexes-query
     * @name IndexesQueryDelete
     * @summary Удалить индекс из запроса
     * @request DELETE:/indexes_query/{index_id}/{query_id}
     * @secure
     */
    indexesQueryDelete: (
      indexId: number,
      queryId: number,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesQueryJSON, Record<string, string>>({
        path: `/indexes_query/${indexId}/${queryId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  queries = {
    /**
     * @description Возвращает запросы с возможностью фильтрации по датам и статусу
     *
     * @tags queries
     * @name QueriesList
     * @summary Получить список запросов
     * @request GET:/queries
     * @secure
     */
    queriesList: (
      query?: {
        /** Начальная дата (YYYY-MM-DD) */
        "from-date"?: string;
        /** Конечная дата (YYYY-MM-DD) */
        "to-date"?: string;
        /** Статус запроса */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApitypesQueryJSON[], Record<string, string>>({
        path: `/queries`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о текущем черновике запроса пользователя
     *
     * @tags queries
     * @name QueryCartList
     * @summary Получить корзину запроса
     * @request GET:/queries/query-cart
     * @secure
     */
    queryCartList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/queries/query-cart`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает полную информацию о запросе включая индексы
     *
     * @tags queries
     * @name QueriesDetail
     * @summary Получить запрос по ID
     * @request GET:/queries/{id}
     * @secure
     */
    queriesDetail: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/queries/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные запроса
     *
     * @tags queries
     * @name ChangeQueryUpdate
     * @summary Изменить запрос
     * @request PUT:/queries/{id}/change-query
     * @secure
     */
    changeQueryUpdate: (
      id: number,
      query: ApitypesQueryJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesQueryJSON, Record<string, string>>({
        path: `/queries/${id}/change-query`,
        method: "PUT",
        body: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет логическое удаление запроса
     *
     * @tags queries
     * @name DeleteQueryDelete
     * @summary Удалить запрос
     * @request DELETE:/queries/{id}/delete-query
     * @secure
     */
    deleteQueryDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/queries/${id}/delete-query`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Изменяет статус запроса (только для модераторов)
     *
     * @tags queries
     * @name FinishUpdate
     * @summary Модерировать запрос
     * @request PUT:/queries/{id}/finish
     * @secure
     */
    finishUpdate: (
      id: number,
      status: ApitypesStatusJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesQueryJSON, Record<string, string>>({
        path: `/queries/${id}/finish`,
        method: "PUT",
        body: status,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Переводит запрос в статус "formed"
     *
     * @tags queries
     * @name FormUpdate
     * @summary Сформировать запрос
     * @request PUT:/queries/{id}/form
     * @secure
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<ApitypesQueryJSON, Record<string, string>>({
        path: `/queries/${id}/form`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Принимает логин/пароль, возвращает jwt-токен в формате {"token":"..."}.
     *
     * @tags users
     * @name SignInCreate
     * @summary Вход (получение токена)
     * @request POST:/users/sign-in
     */
    signInCreate: (credentials: ApitypesUserJSON, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/users/sign-in`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет токен текущего пользователя из хранилища. Возвращает {"status":"signed_out"}.
     *
     * @tags users
     * @name SignOutCreate
     * @summary Выход (удаление токена)
     * @request POST:/users/sign-out
     * @secure
     */
    signOutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/users/sign-out`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Регистрирует нового пользователя. Возвращает URL созданного ресурса в Location и тело созданного пользователя.
     *
     * @tags users
     * @name SignUpCreate
     * @summary Регистрация пользователя
     * @request POST:/users/sign-up
     */
    signUpCreate: (user: ApitypesUserJSON, params: RequestParams = {}) =>
      this.request<ApitypesUserJSON, Record<string, string>>({
        path: `/users/sign-up`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает данные профиля (доступен только тот, чей UUID совпадает с user_id в токене).
     *
     * @tags users
     * @name ProfileList
     * @summary Получить профиль пользователя
     * @request GET:/users/{login}/profile
     * @secure
     */
    profileList: (login: string, params: RequestParams = {}) =>
      this.request<ApitypesUserJSON, Record<string, string>>({
        path: `/users/${login}/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет профиль пользователя (может делать только сам пользователь).
     *
     * @tags users
     * @name ProfileUpdate
     * @summary Изменить профиль пользователя
     * @request PUT:/users/{login}/profile
     * @secure
     */
    profileUpdate: (
      login: string,
      user: ApitypesUserJSON,
      params: RequestParams = {},
    ) =>
      this.request<ApitypesUserJSON, Record<string, string>>({
        path: `/users/${login}/profile`,
        method: "PUT",
        body: user,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
