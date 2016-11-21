# name: discourse-idnet-template
# about: IDNet template
# version: 0.0.1
# authors: Goran G.

after_initialize do
  module DiscourseIdnetTemplate
    class Engine < ::Rails::Engine
      engine_name "discourse-idnet-template"
      isolate_namespace DiscourseIdnetTemplate
    end

    Rails.application.config.assets.paths.unshift File.expand_path('../assets', __FILE__)
  end

  class LastTopicSerializer < ::BasicTopicSerializer
    attributes :slug,
               :title,
               :last_posted_at

    has_one :last_poster, serializer: ::BasicUserSerializer, embed: :objects
  end

  CategoryDetailedSerializer.class_eval do
    attributes :last_topic

    has_one :last_topic, serializer: LastTopicSerializer, embed: :object

    def last_topic
      object.topics.last
    end
  end

  ListableTopicSerializer.class_eval do
    has_one :user, serializer: ::BasicUserSerializer, embed: :objects, key: :creator

    def include_last_poster?
      true
    end
  end

  PostSerializer.class_eval do
    attributes :user_post_count,
               :user_joined_at

    def user_post_count
      object.try(:user).try(:post_count)
    end

    def user_joined_at
      object.try(:user).try(:created_at)
    end
  end

  TopicViewSerializer.class_eval do
    def details
      result = {
        auto_close_at: object.topic.auto_close_at,
        auto_close_hours: object.topic.auto_close_hours,
        auto_close_based_on_last_post: object.topic.auto_close_based_on_last_post,
        created_by: BasicUserSerializer.new(object.topic.user, scope: scope, root: false),
        last_poster: BasicUserSerializer.new(object.topic.last_poster, scope: scope, root: false)
      }

      if object.topic.private_message?
        allowed_user_ids = Set.new

        result[:allowed_groups] = object.topic.allowed_groups.map do |group|
          allowed_user_ids.merge(GroupUser.where(group: group).pluck(:user_id))
          BasicGroupSerializer.new(group, scope: scope, root: false)
        end

        result[:allowed_users] = object.topic.allowed_users.select do |user|
          !allowed_user_ids.include?(user.id)
        end.map do |user|
          BasicUserSerializer.new(user, scope: scope, root: false)
        end
      end

      if object.post_counts_by_user.present?
        result[:participants] = object.post_counts_by_user.map do |pc|
          TopicPostCountSerializer.new({user: object.participants[pc[0]], post_count: pc[1]}, scope: scope, root: false)
        end
      end

      if object.links.present?
        result[:links] = object.links.map do |user|
          TopicLinkSerializer.new(user, scope: scope, root: false)
        end
      end

      if has_topic_user?
        result[:notification_level] = object.topic_user.notification_level
        result[:notifications_reason_id] = object.topic_user.notifications_reason_id
      else
        result[:notification_level] = TopicUser.notification_levels[:regular]
      end

      result[:can_move_posts] = true if scope.can_move_posts?(object.topic)
      result[:can_edit] = true if scope.can_edit?(object.topic)
      result[:can_delete] = true if scope.can_delete?(object.topic)
      result[:can_recover] = true if scope.can_recover_topic?(object.topic)
      result[:can_remove_allowed_users] = true if scope.can_remove_allowed_users?(object.topic)
      result[:can_invite_to] = true if scope.can_invite_to?(object.topic)
      result[:can_create_post] = true if scope.can_create?(Post, object.topic)
      result[:can_reply_as_new_topic] = true if scope.can_reply_as_new_topic?(object.topic)
      result[:can_flag_topic] = actions_summary.any? { |a| a[:can_act] }
      result
    end
  end
end

register_asset "javascripts/discourse/components/categories-only.js.es6"

register_asset "stylesheets/common/base/_topic-list.scss"
register_asset "stylesheets/common/base/discourse.scss"
register_asset "stylesheets/common/base/header.scss"
register_asset "stylesheets/common/base/menu-panel.scss"
register_asset "stylesheets/common/base/topic-post.scss"
register_asset "stylesheets/common/components/badges.css.scss"
register_asset "stylesheets/common/components/keyboard_shortcuts.css.scss"
register_asset "stylesheets/common/components/navs.css.scss"
register_asset "stylesheets/common/foundation/colors.scss"
register_asset "stylesheets/common/topic-timeline.scss"
register_asset "stylesheets/desktop/category-list.scss", :desktop
register_asset "stylesheets/desktop/discourse.scss", :desktop
register_asset "stylesheets/desktop/topic-list.scss", :desktop
register_asset "stylesheets/desktop/topic-post.scss", :desktop
register_asset "stylesheets/desktop/topic.scss", :desktop
register_asset "stylesheets/desktop/idnet.scss", :desktop
