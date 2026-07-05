import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: string; output: string; }
};

export type Lock = {
  __typename?: 'Lock';
  createdAt: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  lockAddress: Scalars['String']['output'];
  lockTimeEnd: Scalars['BigInt']['output'];
  lockingAmount: Scalars['BigInt']['output'];
  owner: Scalars['String']['output'];
  projectImageUrl: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type LockWhereInput = {
  lockAddress?: InputMaybe<StringWhereInput>;
  owner?: InputMaybe<StringWhereInput>;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PlatformStats = {
  __typename?: 'PlatformStats';
  id: Scalars['ID']['output'];
  totalLPLockers: Scalars['BigInt']['output'];
  totalSales: Scalars['BigInt']['output'];
  totalTokenLockers: Scalars['BigInt']['output'];
  totalTokens: Scalars['BigInt']['output'];
};

export type Presale = {
  __typename?: 'Presale';
  createdAt: Scalars['BigInt']['output'];
  endTime?: Maybe<Scalars['BigInt']['output']>;
  hardCap?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['ID']['output'];
  liquidityAmount?: Maybe<Scalars['BigInt']['output']>;
  liquidityBPS?: Maybe<Scalars['BigInt']['output']>;
  maxBuy?: Maybe<Scalars['BigInt']['output']>;
  participantCount?: Maybe<Scalars['BigInt']['output']>;
  saleAddress: Scalars['String']['output'];
  saleOwner: Scalars['String']['output'];
  saleSold?: Maybe<Scalars['BigInt']['output']>;
  salesJson?: Maybe<Scalars['String']['output']>;
  softCap?: Maybe<Scalars['BigInt']['output']>;
  startTime?: Maybe<Scalars['BigInt']['output']>;
  status: PresaleStatus;
  token: Scalars['String']['output'];
  totalSold?: Maybe<Scalars['BigInt']['output']>;
  totalTokensForLiquidity?: Maybe<Scalars['BigInt']['output']>;
  totalTokensForSale?: Maybe<Scalars['BigInt']['output']>;
  treasuryAmount?: Maybe<Scalars['BigInt']['output']>;
};

export type PresaleOrderByInput = {
  createdAt?: InputMaybe<OrderDirection>;
};

export type PresalePurchase = {
  __typename?: 'PresalePurchase';
  buyer: Scalars['String']['output'];
  createdAt: Scalars['BigInt']['output'];
  ethAmount: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  saleAddress: Scalars['String']['output'];
};

export type PresalePurchaseOrderByInput = {
  createdAt?: InputMaybe<OrderDirection>;
};

export type PresalePurchaseWhereInput = {
  buyer?: InputMaybe<StringWhereInput>;
  saleAddress?: InputMaybe<StringWhereInput>;
};

export enum PresaleStatus {
  Active = 'ACTIVE',
  Finalized = 'FINALIZED'
}

export type PresaleStatusWhereInput = {
  _eq?: InputMaybe<PresaleStatus>;
};

export type PresaleWhereInput = {
  saleAddress?: InputMaybe<StringWhereInput>;
  saleOwner?: InputMaybe<StringWhereInput>;
  status?: InputMaybe<PresaleStatusWhereInput>;
};

export type Query = {
  __typename?: 'Query';
  Lock: Array<Lock>;
  PlatformStats?: Maybe<PlatformStats>;
  Presale: Array<Presale>;
  PresalePurchase: Array<PresalePurchase>;
  Tokens: Array<Tokens>;
};


export type QueryLockArgs = {
  where?: InputMaybe<LockWhereInput>;
};


export type QueryPresaleArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<PresaleOrderByInput>;
  where?: InputMaybe<PresaleWhereInput>;
};


export type QueryPresalePurchaseArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<PresalePurchaseOrderByInput>;
  where?: InputMaybe<PresalePurchaseWhereInput>;
};


export type QueryTokensArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<TokensOrderByInput>;
  where?: InputMaybe<TokensWhereInput>;
};

export type StringWhereInput = {
  _eq?: InputMaybe<Scalars['String']['input']>;
};

export enum TokenType {
  Fee = 'FEE',
  Standard = 'STANDARD'
}

export type Tokens = {
  __typename?: 'Tokens';
  createdAt: Scalars['BigInt']['output'];
  decimalPlaces: Scalars['BigInt']['output'];
  fee?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  token: Scalars['String']['output'];
  tokenType: TokenType;
  totalSupply: Scalars['BigInt']['output'];
  transferTax?: Maybe<Scalars['BigInt']['output']>;
};

export type TokensOrderByInput = {
  createdAt?: InputMaybe<OrderDirection>;
};

export type TokensWhereInput = {
  owner?: InputMaybe<StringWhereInput>;
};

export type GetPlatformStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPlatformStatsQuery = { __typename?: 'Query', PlatformStats?: { __typename?: 'PlatformStats', totalTokens: string, totalTokenLockers: string, totalLPLockers: string, totalSales: string } };

export type GetRecentTokensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecentTokensQuery = { __typename?: 'Query', Tokens: Array<{ __typename?: 'Tokens', id: string, token: string, name: string, symbol: string, totalSupply: string, decimalPlaces: string, owner: string, tokenType: TokenType, createdAt: string, fee?: string, transferTax?: string }> };

export type GetUserTokensQueryVariables = Exact<{
  owner: Scalars['String']['input'];
}>;


export type GetUserTokensQuery = { __typename?: 'Query', Tokens: Array<{ __typename?: 'Tokens', id: string, token: string, name: string, symbol: string, totalSupply: string, decimalPlaces: string, owner: string, tokenType: TokenType, createdAt: string, fee?: string, transferTax?: string }> };

export type GetUserLocksQueryVariables = Exact<{
  owner: Scalars['String']['input'];
}>;


export type GetUserLocksQuery = { __typename?: 'Query', Lock: Array<{ __typename?: 'Lock', id: string, token: string, owner: string, lockingAmount: string, lockTimeEnd: string, projectImageUrl: string, createdAt: string, lockAddress: string }> };

export type GetLockQueryVariables = Exact<{
  lockAddress: Scalars['String']['input'];
}>;


export type GetLockQuery = { __typename?: 'Query', Lock: Array<{ __typename?: 'Lock', id: string, token: string, owner: string, lockingAmount: string, lockTimeEnd: string, projectImageUrl: string, createdAt: string, lockAddress: string }> };

export type GetAllPresalesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPresalesQuery = { __typename?: 'Query', Presale: Array<{ __typename?: 'Presale', id: string, saleAddress: string, saleOwner: string, token: string, createdAt: string, status: PresaleStatus, startTime?: string, endTime?: string, softCap?: string, hardCap?: string, maxBuy?: string, totalTokensForSale?: string, totalTokensForLiquidity?: string, liquidityBPS?: string, salesJson?: string, saleSold?: string, participantCount?: string, totalSold?: string, liquidityAmount?: string, treasuryAmount?: string }> };

export type GetPresaleQueryVariables = Exact<{
  saleAddress: Scalars['String']['input'];
}>;


export type GetPresaleQuery = { __typename?: 'Query', Presale: Array<{ __typename?: 'Presale', id: string, saleAddress: string, saleOwner: string, token: string, createdAt: string, status: PresaleStatus, startTime?: string, endTime?: string, softCap?: string, hardCap?: string, maxBuy?: string, totalTokensForSale?: string, totalTokensForLiquidity?: string, liquidityBPS?: string, salesJson?: string, saleSold?: string, participantCount?: string, totalSold?: string, liquidityAmount?: string, treasuryAmount?: string }> };

export type GetPresalesByOwnerQueryVariables = Exact<{
  owner: Scalars['String']['input'];
}>;


export type GetPresalesByOwnerQuery = { __typename?: 'Query', Presale: Array<{ __typename?: 'Presale', id: string, saleAddress: string, saleOwner: string, token: string, createdAt: string, status: PresaleStatus, startTime?: string, endTime?: string, softCap?: string, hardCap?: string, maxBuy?: string, totalTokensForSale?: string, totalTokensForLiquidity?: string, liquidityBPS?: string, salesJson?: string, saleSold?: string, participantCount?: string, totalSold?: string, liquidityAmount?: string, treasuryAmount?: string }> };

export type GetPresalePurchasesQueryVariables = Exact<{
  saleAddress: Scalars['String']['input'];
}>;


export type GetPresalePurchasesQuery = { __typename?: 'Query', PresalePurchase: Array<{ __typename?: 'PresalePurchase', id: string, saleAddress: string, buyer: string, ethAmount: string, createdAt: string }> };

export type GetUserPresalePurchasesQueryVariables = Exact<{
  buyer: Scalars['String']['input'];
}>;


export type GetUserPresalePurchasesQuery = { __typename?: 'Query', PresalePurchase: Array<{ __typename?: 'PresalePurchase', id: string, saleAddress: string, buyer: string, ethAmount: string, createdAt: string }> };


export const GetPlatformStatsDocument = gql`
    query GetPlatformStats {
  PlatformStats {
    totalTokens
    totalTokenLockers
    totalLPLockers
    totalSales
  }
}
    `;

/**
 * __useGetPlatformStatsQuery__
 *
 * To run a query within a React component, call `useGetPlatformStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlatformStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlatformStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPlatformStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetPlatformStatsQuery, GetPlatformStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPlatformStatsQuery, GetPlatformStatsQueryVariables>(GetPlatformStatsDocument, options);
      }
export function useGetPlatformStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlatformStatsQuery, GetPlatformStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPlatformStatsQuery, GetPlatformStatsQueryVariables>(GetPlatformStatsDocument, options);
        }
export function useGetPlatformStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPlatformStatsQuery, GetPlatformStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPlatformStatsQuery, GetPlatformStatsQueryVariables>(GetPlatformStatsDocument, options);
        }
export type GetPlatformStatsQueryHookResult = ReturnType<typeof useGetPlatformStatsQuery>;
export type GetPlatformStatsLazyQueryHookResult = ReturnType<typeof useGetPlatformStatsLazyQuery>;
export type GetPlatformStatsSuspenseQueryHookResult = ReturnType<typeof useGetPlatformStatsSuspenseQuery>;
export type GetPlatformStatsQueryResult = Apollo.QueryResult<GetPlatformStatsQuery, GetPlatformStatsQueryVariables>;
export const GetRecentTokensDocument = gql`
    query GetRecentTokens {
  Tokens(order_by: {createdAt: desc}, limit: 3) {
    id
    token
    name
    symbol
    totalSupply
    decimalPlaces
    owner
    tokenType
    createdAt
    fee
    transferTax
  }
}
    `;

/**
 * __useGetRecentTokensQuery__
 *
 * To run a query within a React component, call `useGetRecentTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecentTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecentTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRecentTokensQuery(baseOptions?: Apollo.QueryHookOptions<GetRecentTokensQuery, GetRecentTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecentTokensQuery, GetRecentTokensQueryVariables>(GetRecentTokensDocument, options);
      }
export function useGetRecentTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecentTokensQuery, GetRecentTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecentTokensQuery, GetRecentTokensQueryVariables>(GetRecentTokensDocument, options);
        }
export function useGetRecentTokensSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRecentTokensQuery, GetRecentTokensQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRecentTokensQuery, GetRecentTokensQueryVariables>(GetRecentTokensDocument, options);
        }
export type GetRecentTokensQueryHookResult = ReturnType<typeof useGetRecentTokensQuery>;
export type GetRecentTokensLazyQueryHookResult = ReturnType<typeof useGetRecentTokensLazyQuery>;
export type GetRecentTokensSuspenseQueryHookResult = ReturnType<typeof useGetRecentTokensSuspenseQuery>;
export type GetRecentTokensQueryResult = Apollo.QueryResult<GetRecentTokensQuery, GetRecentTokensQueryVariables>;
export const GetUserTokensDocument = gql`
    query GetUserTokens($owner: String!) {
  Tokens(where: {owner: {_eq: $owner}}) {
    id
    token
    name
    symbol
    totalSupply
    decimalPlaces
    owner
    tokenType
    createdAt
    fee
    transferTax
  }
}
    `;

/**
 * __useGetUserTokensQuery__
 *
 * To run a query within a React component, call `useGetUserTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserTokensQuery({
 *   variables: {
 *      owner: // value for 'owner'
 *   },
 * });
 */
export function useGetUserTokensQuery(baseOptions: Apollo.QueryHookOptions<GetUserTokensQuery, GetUserTokensQueryVariables> & ({ variables: GetUserTokensQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserTokensQuery, GetUserTokensQueryVariables>(GetUserTokensDocument, options);
      }
export function useGetUserTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserTokensQuery, GetUserTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserTokensQuery, GetUserTokensQueryVariables>(GetUserTokensDocument, options);
        }
export function useGetUserTokensSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserTokensQuery, GetUserTokensQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserTokensQuery, GetUserTokensQueryVariables>(GetUserTokensDocument, options);
        }
export type GetUserTokensQueryHookResult = ReturnType<typeof useGetUserTokensQuery>;
export type GetUserTokensLazyQueryHookResult = ReturnType<typeof useGetUserTokensLazyQuery>;
export type GetUserTokensSuspenseQueryHookResult = ReturnType<typeof useGetUserTokensSuspenseQuery>;
export type GetUserTokensQueryResult = Apollo.QueryResult<GetUserTokensQuery, GetUserTokensQueryVariables>;
export const GetUserLocksDocument = gql`
    query GetUserLocks($owner: String!) {
  Lock(where: {owner: {_eq: $owner}}) {
    id
    token
    owner
    lockingAmount
    lockTimeEnd
    projectImageUrl
    createdAt
    lockAddress
  }
}
    `;

/**
 * __useGetUserLocksQuery__
 *
 * To run a query within a React component, call `useGetUserLocksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserLocksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserLocksQuery({
 *   variables: {
 *      owner: // value for 'owner'
 *   },
 * });
 */
export function useGetUserLocksQuery(baseOptions: Apollo.QueryHookOptions<GetUserLocksQuery, GetUserLocksQueryVariables> & ({ variables: GetUserLocksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserLocksQuery, GetUserLocksQueryVariables>(GetUserLocksDocument, options);
      }
export function useGetUserLocksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserLocksQuery, GetUserLocksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserLocksQuery, GetUserLocksQueryVariables>(GetUserLocksDocument, options);
        }
export function useGetUserLocksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserLocksQuery, GetUserLocksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserLocksQuery, GetUserLocksQueryVariables>(GetUserLocksDocument, options);
        }
export type GetUserLocksQueryHookResult = ReturnType<typeof useGetUserLocksQuery>;
export type GetUserLocksLazyQueryHookResult = ReturnType<typeof useGetUserLocksLazyQuery>;
export type GetUserLocksSuspenseQueryHookResult = ReturnType<typeof useGetUserLocksSuspenseQuery>;
export type GetUserLocksQueryResult = Apollo.QueryResult<GetUserLocksQuery, GetUserLocksQueryVariables>;
export const GetLockDocument = gql`
    query GetLock($lockAddress: String!) {
  Lock(where: {lockAddress: {_eq: $lockAddress}}) {
    id
    token
    owner
    lockingAmount
    lockTimeEnd
    projectImageUrl
    createdAt
    lockAddress
  }
}
    `;

/**
 * __useGetLockQuery__
 *
 * To run a query within a React component, call `useGetLockQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLockQuery({
 *   variables: {
 *      lockAddress: // value for 'lockAddress'
 *   },
 * });
 */
export function useGetLockQuery(baseOptions: Apollo.QueryHookOptions<GetLockQuery, GetLockQueryVariables> & ({ variables: GetLockQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLockQuery, GetLockQueryVariables>(GetLockDocument, options);
      }
export function useGetLockLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLockQuery, GetLockQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLockQuery, GetLockQueryVariables>(GetLockDocument, options);
        }
export function useGetLockSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLockQuery, GetLockQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLockQuery, GetLockQueryVariables>(GetLockDocument, options);
        }
export type GetLockQueryHookResult = ReturnType<typeof useGetLockQuery>;
export type GetLockLazyQueryHookResult = ReturnType<typeof useGetLockLazyQuery>;
export type GetLockSuspenseQueryHookResult = ReturnType<typeof useGetLockSuspenseQuery>;
export type GetLockQueryResult = Apollo.QueryResult<GetLockQuery, GetLockQueryVariables>;
export const GetAllPresalesDocument = gql`
    query GetAllPresales {
  Presale(order_by: {createdAt: desc}) {
    id
    saleAddress
    saleOwner
    token
    createdAt
    status
    startTime
    endTime
    softCap
    hardCap
    maxBuy
    totalTokensForSale
    totalTokensForLiquidity
    liquidityBPS
    salesJson
    saleSold
    participantCount
    totalSold
    liquidityAmount
    treasuryAmount
  }
}
    `;

/**
 * __useGetAllPresalesQuery__
 *
 * To run a query within a React component, call `useGetAllPresalesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPresalesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPresalesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllPresalesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllPresalesQuery, GetAllPresalesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPresalesQuery, GetAllPresalesQueryVariables>(GetAllPresalesDocument, options);
      }
export function useGetAllPresalesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPresalesQuery, GetAllPresalesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPresalesQuery, GetAllPresalesQueryVariables>(GetAllPresalesDocument, options);
        }
export function useGetAllPresalesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllPresalesQuery, GetAllPresalesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllPresalesQuery, GetAllPresalesQueryVariables>(GetAllPresalesDocument, options);
        }
export type GetAllPresalesQueryHookResult = ReturnType<typeof useGetAllPresalesQuery>;
export type GetAllPresalesLazyQueryHookResult = ReturnType<typeof useGetAllPresalesLazyQuery>;
export type GetAllPresalesSuspenseQueryHookResult = ReturnType<typeof useGetAllPresalesSuspenseQuery>;
export type GetAllPresalesQueryResult = Apollo.QueryResult<GetAllPresalesQuery, GetAllPresalesQueryVariables>;
export const GetPresaleDocument = gql`
    query GetPresale($saleAddress: String!) {
  Presale(where: {saleAddress: {_eq: $saleAddress}}) {
    id
    saleAddress
    saleOwner
    token
    createdAt
    status
    startTime
    endTime
    softCap
    hardCap
    maxBuy
    totalTokensForSale
    totalTokensForLiquidity
    liquidityBPS
    salesJson
    saleSold
    participantCount
    totalSold
    liquidityAmount
    treasuryAmount
  }
}
    `;

/**
 * __useGetPresaleQuery__
 *
 * To run a query within a React component, call `useGetPresaleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPresaleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPresaleQuery({
 *   variables: {
 *      saleAddress: // value for 'saleAddress'
 *   },
 * });
 */
export function useGetPresaleQuery(baseOptions: Apollo.QueryHookOptions<GetPresaleQuery, GetPresaleQueryVariables> & ({ variables: GetPresaleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPresaleQuery, GetPresaleQueryVariables>(GetPresaleDocument, options);
      }
export function useGetPresaleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPresaleQuery, GetPresaleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPresaleQuery, GetPresaleQueryVariables>(GetPresaleDocument, options);
        }
export function useGetPresaleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPresaleQuery, GetPresaleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPresaleQuery, GetPresaleQueryVariables>(GetPresaleDocument, options);
        }
export type GetPresaleQueryHookResult = ReturnType<typeof useGetPresaleQuery>;
export type GetPresaleLazyQueryHookResult = ReturnType<typeof useGetPresaleLazyQuery>;
export type GetPresaleSuspenseQueryHookResult = ReturnType<typeof useGetPresaleSuspenseQuery>;
export type GetPresaleQueryResult = Apollo.QueryResult<GetPresaleQuery, GetPresaleQueryVariables>;
export const GetPresalesByOwnerDocument = gql`
    query GetPresalesByOwner($owner: String!) {
  Presale(where: {saleOwner: {_eq: $owner}}, order_by: {createdAt: desc}) {
    id
    saleAddress
    saleOwner
    token
    createdAt
    status
    startTime
    endTime
    softCap
    hardCap
    maxBuy
    totalTokensForSale
    totalTokensForLiquidity
    liquidityBPS
    salesJson
    saleSold
    participantCount
    totalSold
    liquidityAmount
    treasuryAmount
  }
}
    `;

/**
 * __useGetPresalesByOwnerQuery__
 *
 * To run a query within a React component, call `useGetPresalesByOwnerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPresalesByOwnerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPresalesByOwnerQuery({
 *   variables: {
 *      owner: // value for 'owner'
 *   },
 * });
 */
export function useGetPresalesByOwnerQuery(baseOptions: Apollo.QueryHookOptions<GetPresalesByOwnerQuery, GetPresalesByOwnerQueryVariables> & ({ variables: GetPresalesByOwnerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPresalesByOwnerQuery, GetPresalesByOwnerQueryVariables>(GetPresalesByOwnerDocument, options);
      }
export function useGetPresalesByOwnerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPresalesByOwnerQuery, GetPresalesByOwnerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPresalesByOwnerQuery, GetPresalesByOwnerQueryVariables>(GetPresalesByOwnerDocument, options);
        }
export function useGetPresalesByOwnerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPresalesByOwnerQuery, GetPresalesByOwnerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPresalesByOwnerQuery, GetPresalesByOwnerQueryVariables>(GetPresalesByOwnerDocument, options);
        }
export type GetPresalesByOwnerQueryHookResult = ReturnType<typeof useGetPresalesByOwnerQuery>;
export type GetPresalesByOwnerLazyQueryHookResult = ReturnType<typeof useGetPresalesByOwnerLazyQuery>;
export type GetPresalesByOwnerSuspenseQueryHookResult = ReturnType<typeof useGetPresalesByOwnerSuspenseQuery>;
export type GetPresalesByOwnerQueryResult = Apollo.QueryResult<GetPresalesByOwnerQuery, GetPresalesByOwnerQueryVariables>;
export const GetPresalePurchasesDocument = gql`
    query GetPresalePurchases($saleAddress: String!) {
  PresalePurchase(
    where: {saleAddress: {_eq: $saleAddress}}
    order_by: {createdAt: desc}
  ) {
    id
    saleAddress
    buyer
    ethAmount
    createdAt
  }
}
    `;

/**
 * __useGetPresalePurchasesQuery__
 *
 * To run a query within a React component, call `useGetPresalePurchasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPresalePurchasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPresalePurchasesQuery({
 *   variables: {
 *      saleAddress: // value for 'saleAddress'
 *   },
 * });
 */
export function useGetPresalePurchasesQuery(baseOptions: Apollo.QueryHookOptions<GetPresalePurchasesQuery, GetPresalePurchasesQueryVariables> & ({ variables: GetPresalePurchasesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPresalePurchasesQuery, GetPresalePurchasesQueryVariables>(GetPresalePurchasesDocument, options);
      }
export function useGetPresalePurchasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPresalePurchasesQuery, GetPresalePurchasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPresalePurchasesQuery, GetPresalePurchasesQueryVariables>(GetPresalePurchasesDocument, options);
        }
export function useGetPresalePurchasesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPresalePurchasesQuery, GetPresalePurchasesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPresalePurchasesQuery, GetPresalePurchasesQueryVariables>(GetPresalePurchasesDocument, options);
        }
export type GetPresalePurchasesQueryHookResult = ReturnType<typeof useGetPresalePurchasesQuery>;
export type GetPresalePurchasesLazyQueryHookResult = ReturnType<typeof useGetPresalePurchasesLazyQuery>;
export type GetPresalePurchasesSuspenseQueryHookResult = ReturnType<typeof useGetPresalePurchasesSuspenseQuery>;
export type GetPresalePurchasesQueryResult = Apollo.QueryResult<GetPresalePurchasesQuery, GetPresalePurchasesQueryVariables>;
export const GetUserPresalePurchasesDocument = gql`
    query GetUserPresalePurchases($buyer: String!) {
  PresalePurchase(where: {buyer: {_eq: $buyer}}, order_by: {createdAt: desc}) {
    id
    saleAddress
    buyer
    ethAmount
    createdAt
  }
}
    `;

/**
 * __useGetUserPresalePurchasesQuery__
 *
 * To run a query within a React component, call `useGetUserPresalePurchasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPresalePurchasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPresalePurchasesQuery({
 *   variables: {
 *      buyer: // value for 'buyer'
 *   },
 * });
 */
export function useGetUserPresalePurchasesQuery(baseOptions: Apollo.QueryHookOptions<GetUserPresalePurchasesQuery, GetUserPresalePurchasesQueryVariables> & ({ variables: GetUserPresalePurchasesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPresalePurchasesQuery, GetUserPresalePurchasesQueryVariables>(GetUserPresalePurchasesDocument, options);
      }
export function useGetUserPresalePurchasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPresalePurchasesQuery, GetUserPresalePurchasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPresalePurchasesQuery, GetUserPresalePurchasesQueryVariables>(GetUserPresalePurchasesDocument, options);
        }
export function useGetUserPresalePurchasesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserPresalePurchasesQuery, GetUserPresalePurchasesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserPresalePurchasesQuery, GetUserPresalePurchasesQueryVariables>(GetUserPresalePurchasesDocument, options);
        }
export type GetUserPresalePurchasesQueryHookResult = ReturnType<typeof useGetUserPresalePurchasesQuery>;
export type GetUserPresalePurchasesLazyQueryHookResult = ReturnType<typeof useGetUserPresalePurchasesLazyQuery>;
export type GetUserPresalePurchasesSuspenseQueryHookResult = ReturnType<typeof useGetUserPresalePurchasesSuspenseQuery>;
export type GetUserPresalePurchasesQueryResult = Apollo.QueryResult<GetUserPresalePurchasesQuery, GetUserPresalePurchasesQueryVariables>;