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
        variant="soft"
        type="danger"
        onPress={handleRemoveFollower}
        loading={removeFollowerMutation.isPending}
        disabled={isRemoved}
      >
        <ThemedText variant="primary" weight="medium">
          {isRemoved ? 'Removido' : 'Remover'}
        </ThemedText>
      </Button>
    )
  }

  const getFollowButtonText = () => {
    if (followStatus === 'following') return 'Seguindo'
    if (followStatus === 'pending') return 'Aguardando Solicitação'
    return 'Seguir'
  }

  return (
    <Button
      variant="soft"
      onPress={handleToggleFollow}
      loading={unfollowMutation.isPending || followMutation.isPending || cancelFollowRequestMutation.isPending}
    >
      <ThemedText variant="primary" weight="medium">
        {getFollowButtonText()}
      </ThemedText>
    </Button>
  )
}
