/******************************************************************************
* This file was generated by ZenStack CLI.
******************************************************************************/

/* eslint-disable */
// @ts-nocheck

import type { Prisma, UserOrganization } from "@prisma/client";
import type { UseMutationOptions, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { getHooksContext } from '@zenstackhq/tanstack-query/runtime-v5/react';
import { useModelQuery, useInfiniteModelQuery, useModelMutation } from '@zenstackhq/tanstack-query/runtime-v5/react';
import type { PickEnumerable, CheckSelect, QueryError, ExtraQueryOptions, ExtraMutationOptions } from '@zenstackhq/tanstack-query/runtime-v5';
import type { PolicyCrudKind } from '@zenstackhq/runtime'
import metadata from './__model_meta';
type DefaultError = QueryError;
import { useSuspenseModelQuery, useSuspenseInfiniteModelQuery } from '@zenstackhq/tanstack-query/runtime-v5/react';
import type { UseSuspenseQueryOptions, UseSuspenseInfiniteQueryOptions } from '@tanstack/react-query';

export function useCreateUserOrganization(options?: Omit<(UseMutationOptions<(UserOrganization | undefined), DefaultError, Prisma.UserOrganizationCreateArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.UserOrganizationCreateArgs, DefaultError, UserOrganization, true>('UserOrganization', 'POST', `${endpoint}/userOrganization/create`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.UserOrganizationCreateArgs>(
            args: Prisma.SelectSubset<T, Prisma.UserOrganizationCreateArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, UserOrganization, Prisma.UserOrganizationGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.UserOrganizationCreateArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, UserOrganization, Prisma.UserOrganizationGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useCreateManyUserOrganization(options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.UserOrganizationCreateManyArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.UserOrganizationCreateManyArgs, DefaultError, Prisma.BatchPayload, false>('UserOrganization', 'POST', `${endpoint}/userOrganization/createMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.UserOrganizationCreateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.UserOrganizationCreateManyArgs>,
            options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.UserOrganizationCreateManyArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useFindManyUserOrganization<TArgs extends Prisma.UserOrganizationFindManyArgs, TQueryFnData = Array<Prisma.UserOrganizationGetPayload<TArgs> & { $optimistic?: boolean }>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationFindManyArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/findMany`, args, options, fetch);
}

export function useInfiniteFindManyUserOrganization<TArgs extends Prisma.UserOrganizationFindManyArgs, TQueryFnData = Array<Prisma.UserOrganizationGetPayload<TArgs>>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationFindManyArgs>, options?: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>) {
    options = options ?? { getNextPageParam: () => null };
    const { endpoint, fetch } = getHooksContext();
    return useInfiniteModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/findMany`, args, options, fetch);
}

export function useSuspenseFindManyUserOrganization<TArgs extends Prisma.UserOrganizationFindManyArgs, TQueryFnData = Array<Prisma.UserOrganizationGetPayload<TArgs> & { $optimistic?: boolean }>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationFindManyArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/findMany`, args, options, fetch);
}

export function useSuspenseInfiniteFindManyUserOrganization<TArgs extends Prisma.UserOrganizationFindManyArgs, TQueryFnData = Array<Prisma.UserOrganizationGetPayload<TArgs>>, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationFindManyArgs>, options?: Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>, 'queryKey' | 'initialPageParam'>) {
    options = options ?? { getNextPageParam: () => null };
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/findMany`, args, options, fetch);
}

export function useFindUniqueUserOrganization<TArgs extends Prisma.UserOrganizationFindUniqueArgs, TQueryFnData = Prisma.UserOrganizationGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationFindUniqueArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/findUnique`, args, options, fetch);
}

export function useSuspenseFindUniqueUserOrganization<TArgs extends Prisma.UserOrganizationFindUniqueArgs, TQueryFnData = Prisma.UserOrganizationGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationFindUniqueArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/findUnique`, args, options, fetch);
}

export function useFindFirstUserOrganization<TArgs extends Prisma.UserOrganizationFindFirstArgs, TQueryFnData = Prisma.UserOrganizationGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationFindFirstArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/findFirst`, args, options, fetch);
}

export function useSuspenseFindFirstUserOrganization<TArgs extends Prisma.UserOrganizationFindFirstArgs, TQueryFnData = Prisma.UserOrganizationGetPayload<TArgs> & { $optimistic?: boolean }, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationFindFirstArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/findFirst`, args, options, fetch);
}

export function useUpdateUserOrganization(options?: Omit<(UseMutationOptions<(UserOrganization | undefined), DefaultError, Prisma.UserOrganizationUpdateArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.UserOrganizationUpdateArgs, DefaultError, UserOrganization, true>('UserOrganization', 'PUT', `${endpoint}/userOrganization/update`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.UserOrganizationUpdateArgs>(
            args: Prisma.SelectSubset<T, Prisma.UserOrganizationUpdateArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, UserOrganization, Prisma.UserOrganizationGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.UserOrganizationUpdateArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, UserOrganization, Prisma.UserOrganizationGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useUpdateManyUserOrganization(options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.UserOrganizationUpdateManyArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.UserOrganizationUpdateManyArgs, DefaultError, Prisma.BatchPayload, false>('UserOrganization', 'PUT', `${endpoint}/userOrganization/updateMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.UserOrganizationUpdateManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.UserOrganizationUpdateManyArgs>,
            options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.UserOrganizationUpdateManyArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useUpsertUserOrganization(options?: Omit<(UseMutationOptions<(UserOrganization | undefined), DefaultError, Prisma.UserOrganizationUpsertArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.UserOrganizationUpsertArgs, DefaultError, UserOrganization, true>('UserOrganization', 'POST', `${endpoint}/userOrganization/upsert`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.UserOrganizationUpsertArgs>(
            args: Prisma.SelectSubset<T, Prisma.UserOrganizationUpsertArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, UserOrganization, Prisma.UserOrganizationGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.UserOrganizationUpsertArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, UserOrganization, Prisma.UserOrganizationGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteUserOrganization(options?: Omit<(UseMutationOptions<(UserOrganization | undefined), DefaultError, Prisma.UserOrganizationDeleteArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.UserOrganizationDeleteArgs, DefaultError, UserOrganization, true>('UserOrganization', 'DELETE', `${endpoint}/userOrganization/delete`, metadata, options, fetch, true)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.UserOrganizationDeleteArgs>(
            args: Prisma.SelectSubset<T, Prisma.UserOrganizationDeleteArgs>,
            options?: Omit<(UseMutationOptions<(CheckSelect<T, UserOrganization, Prisma.UserOrganizationGetPayload<T>> | undefined), DefaultError, Prisma.SelectSubset<T, Prisma.UserOrganizationDeleteArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as (CheckSelect<T, UserOrganization, Prisma.UserOrganizationGetPayload<T>> | undefined);
        },
    };
    return mutation;
}

export function useDeleteManyUserOrganization(options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.UserOrganizationDeleteManyArgs> & ExtraMutationOptions), 'mutationFn'>) {
    const { endpoint, fetch } = getHooksContext();
    const _mutation =
        useModelMutation<Prisma.UserOrganizationDeleteManyArgs, DefaultError, Prisma.BatchPayload, false>('UserOrganization', 'DELETE', `${endpoint}/userOrganization/deleteMany`, metadata, options, fetch, false)
        ;
    const mutation = {
        ..._mutation,
        mutateAsync: async <T extends Prisma.UserOrganizationDeleteManyArgs>(
            args: Prisma.SelectSubset<T, Prisma.UserOrganizationDeleteManyArgs>,
            options?: Omit<(UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SelectSubset<T, Prisma.UserOrganizationDeleteManyArgs>> & ExtraMutationOptions), 'mutationFn'>
        ) => {
            return (await _mutation.mutateAsync(
                args,
                options as any
            )) as Prisma.BatchPayload;
        },
    };
    return mutation;
}

export function useAggregateUserOrganization<TArgs extends Prisma.UserOrganizationAggregateArgs, TQueryFnData = Prisma.GetUserOrganizationAggregateType<TArgs>, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationAggregateArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/aggregate`, args, options, fetch);
}

export function useSuspenseAggregateUserOrganization<TArgs extends Prisma.UserOrganizationAggregateArgs, TQueryFnData = Prisma.GetUserOrganizationAggregateType<TArgs>, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationAggregateArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/aggregate`, args, options, fetch);
}

export function useGroupByUserOrganization<TArgs extends Prisma.UserOrganizationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<TArgs>>, Prisma.Extends<'take', Prisma.Keys<TArgs>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? { orderBy: Prisma.UserOrganizationGroupByArgs['orderBy'] } : { orderBy?: Prisma.UserOrganizationGroupByArgs['orderBy'] }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<TArgs['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
        ? never
        : P extends string
        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
        : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`,
        ]
    }[HavingFields]
    : 'take' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields], TQueryFnData = {} extends InputErrors ?
    Array<PickEnumerable<Prisma.UserOrganizationGroupByOutputType, TArgs['by']> &
        {
            [P in ((keyof TArgs) & (keyof Prisma.UserOrganizationGroupByOutputType))]: P extends '_count'
            ? TArgs[P] extends boolean
            ? number
            : Prisma.GetScalarType<TArgs[P], Prisma.UserOrganizationGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.UserOrganizationGroupByOutputType[P]>
        }
    > : InputErrors, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.UserOrganizationGroupByArgs, OrderByArg> & InputErrors>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/groupBy`, args, options, fetch);
}

export function useSuspenseGroupByUserOrganization<TArgs extends Prisma.UserOrganizationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<TArgs>>, Prisma.Extends<'take', Prisma.Keys<TArgs>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? { orderBy: Prisma.UserOrganizationGroupByArgs['orderBy'] } : { orderBy?: Prisma.UserOrganizationGroupByArgs['orderBy'] }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<TArgs['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
        ? never
        : P extends string
        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
        : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`,
        ]
    }[HavingFields]
    : 'take' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<TArgs>
    ? 'orderBy' extends Prisma.Keys<TArgs>
    ? ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields]
    : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
        ? never
        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
    }[OrderFields], TQueryFnData = {} extends InputErrors ?
    Array<PickEnumerable<Prisma.UserOrganizationGroupByOutputType, TArgs['by']> &
        {
            [P in ((keyof TArgs) & (keyof Prisma.UserOrganizationGroupByOutputType))]: P extends '_count'
            ? TArgs[P] extends boolean
            ? number
            : Prisma.GetScalarType<TArgs[P], Prisma.UserOrganizationGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.UserOrganizationGroupByOutputType[P]>
        }
    > : InputErrors, TData = TQueryFnData, TError = DefaultError>(args: Prisma.SelectSubset<TArgs, Prisma.SubsetIntersection<TArgs, Prisma.UserOrganizationGroupByArgs, OrderByArg> & InputErrors>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/groupBy`, args, options, fetch);
}

export function useCountUserOrganization<TArgs extends Prisma.UserOrganizationCountArgs, TQueryFnData = TArgs extends { select: any; } ? TArgs['select'] extends true ? number : Prisma.GetScalarType<TArgs['select'], Prisma.UserOrganizationCountAggregateOutputType> : number, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationCountArgs>, options?: (Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/count`, args, options, fetch);
}

export function useSuspenseCountUserOrganization<TArgs extends Prisma.UserOrganizationCountArgs, TQueryFnData = TArgs extends { select: any; } ? TArgs['select'] extends true ? number : Prisma.GetScalarType<TArgs['select'], Prisma.UserOrganizationCountAggregateOutputType> : number, TData = TQueryFnData, TError = DefaultError>(args?: Prisma.SelectSubset<TArgs, Prisma.UserOrganizationCountArgs>, options?: (Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useSuspenseModelQuery<TQueryFnData, TData, TError>('UserOrganization', `${endpoint}/userOrganization/count`, args, options, fetch);
}
import type { OrganizationRole } from '@prisma/client';

export function useCheckUserOrganization<TError = DefaultError>(args: { operation: PolicyCrudKind; where?: { id?: string; userId?: string; organizationId?: string; role?: OrganizationRole }; }, options?: (Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions)) {
    const { endpoint, fetch } = getHooksContext();
    return useModelQuery<boolean, boolean, TError>('UserOrganization', `${endpoint}/userOrganization/check`, args, options, fetch);
}
