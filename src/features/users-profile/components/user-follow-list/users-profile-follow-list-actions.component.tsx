import React, { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { Button, ThemedText } from '@src/shared/components'

import { FollowRequestsService } from '../../services'
import { FollowService } from '../../services'
import { ListFollowersResponse } from '../../types'

type UsersProfileFollowListActions = {
  followRelation: ListFollowersResponse
  type: string
}

export const UsersProfileFollowListActions: React.FC<UsersProfileFollowListActions> = ({ followRelation, type }) => {
  const [followStatus, setFollowStatus] = useState<'following' | 'pending' | 'none'>('following')
  const [isRemoved, setIsRemoved] = useState(false)

  const unfollowMutation = useMutation({
    mutationFn: () => FollowService.unfollow(followRelation.userId),
    onSuccess: () => {
      setFollowStatus('none')
    }
  })

  const followMutation = useMutation({
    mutationFn: () => FollowRequestsService.requestFollow(followRelation.userId),
    onSuccess: () => {
      setFollowStatus('pending')
    }
  })

  const cancelFollowRequestMutation = useMutation({
    mutationFn: () => FollowRequestsService.cancelRequestFollow(followRelation.userId),
    onSuccess: () => {
      setFollowStatus('none')
    }
  })

  const removeFollowerMutation = useMutation({
    mutationFn: () => FollowService.removeFollower(followRelation.id),
    onSuccess: () => {
      setIsRemoved(true)
    }
  })

  const handleToggleFollow = () => {
    if (followStatus === 'following') {
      unfollowMutation.mutate()
    } else if (followStatus === 'none') {
      followMutation.mutate()
    } else if (followStatus === 'pending') {
      cancelFollowRequestMutation.mutate()
    }
  }

  const handleRemoveFollower = () => {
    removeFollowerMutation.mutate()
  }

  if (type === 'followers') {
    return (
      <Button
        variant="outline"
        type="secondary"
        size="sm"
        onPress={handleRemoveFollower}
        loading={removeFollowerMutation.isPending}
        disabled={isRemoved}
      >
        <ThemedText size="sm" weight="medium" color="textSecondary">
          {isRemoved ? 'removido' : 'remover'}
        </ThemedText>
      </Button>
    )
  }

  const isFollowing = followStatus === 'following'
  const isPending = followStatus === 'pending'

  return (
    <Button
      variant={isFollowing || isPending ? 'outline' : 'solid'}
      type={isFollowing || isPending ? 'secondary' : 'primary'}
      size="sm"
      onPress={handleToggleFollow}
      loading={unfollowMutation.isPending || followMutation.isPending || cancelFollowRequestMutation.isPending}
    >
      <ThemedText
        size="sm"
        weight="medium"
        color={isFollowing || isPending ? 'textSecondary' : 'textPrimary'}
      >
        {isFollowing ? 'seguindo' : isPending ? 'pendente' : 'seguir'}
      </ThemedText>
    </Button>
  )
}
