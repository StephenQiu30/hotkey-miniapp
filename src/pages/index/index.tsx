/// <reference path="../../services/hotkey/hotkey-server/typings.d.ts" />

import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import { useMemo, useState } from "react";

import { HOTKEY_TOKEN } from "@/utils/request";

type MiniappHotspot = HotKeyAPI.HotspotRead & {
  saved: boolean;
};

const topicIdeas: HotKeyAPI.TopicIdeaRead[] = [
  {
    title: "用 60 秒讲清 AI agent 热点",
    angle: "面向普通创作者解释工具链价值。",
    format: "短视频脚本",
    rationale: "适合快速跟进热点。",
  },
  {
    title: "普通人如何搭建热点监控流",
    angle: "从收藏、提醒和选题判断展开。",
    format: "图文教程",
    rationale: "适合沉淀系列内容。",
  },
];

const initialHotspots: MiniappHotspot[] = [
  {
    id: 101,
    title: "AI agent 工作流成为创作者工具新热点",
    url: "https://example.com/agent-workflow",
    source_id: 1,
    keyword_id: 1,
    author: "GitHub Trending",
    snippet: "多个开源项目开始围绕 agent 工作流提供模板、调度和内容生产插件。",
    published_at: "2026-05-24T09:00:00Z",
    fetched_at: "2026-05-24T09:20:00Z",
    status: "active",
    cluster_id: "ai-agent-workflow",
    rank_score: 91,
    trend_score: 78,
    raw_payload: {},
    created_at: "2026-05-24T09:20:00Z",
    updated_at: "2026-05-24T09:20:00Z",
    ai_analysis: {
      id: 1,
      hotspot_id: 101,
      is_real: true,
      relevance_score: "92.00",
      relevance_reason: "与创作者工具和自动化内容生产高度相关。",
      keyword_mentioned: true,
      importance: "high",
      summary: "AI agent 工具链正在从开发者圈扩散到内容生产流程。",
      quick_understanding: ["热度来自开源工具集中发布。", "创作者可把它转化为效率工具教程。", "适合做系列化选题。"],
      topic_ideas: topicIdeas,
      model_name: "local-fallback",
      raw_response: {},
      created_at: "2026-05-24T09:20:00Z",
      updated_at: "2026-05-24T09:20:00Z",
    },
    saved: true,
  },
  {
    id: 102,
    title: "小程序提醒成为热点跟进轻量入口",
    url: "https://example.com/miniapp-alert",
    source_id: 2,
    keyword_id: 2,
    author: "RSS",
    snippet: "内容团队希望在手机端快速查看收藏和提醒状态。",
    published_at: "2026-05-24T08:00:00Z",
    fetched_at: "2026-05-24T08:10:00Z",
    status: "active",
    cluster_id: "miniapp-alert",
    rank_score: 82,
    trend_score: 63,
    raw_payload: {},
    created_at: "2026-05-24T08:10:00Z",
    updated_at: "2026-05-24T08:10:00Z",
    ai_analysis: null,
    saved: false,
  },
];

export default function IndexPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hotspots, setHotspots] = useState(initialHotspots);
  const [selectedHotspotId, setSelectedHotspotId] = useState(initialHotspots[0].id);
  const selected = useMemo(() => hotspots.find((item) => item.id === selectedHotspotId) ?? hotspots[0], [hotspots, selectedHotspotId]);
  const isWebHost = Taro.getEnv() === Taro.ENV_TYPE.WEB;
  const notificationItems: HotKeyAPI.NotificationListResponse = {
    limit: 2,
    offset: 0,
    items: [
      {
        id: 1,
        hotspot_id: selected.id,
        report_id: null,
        channel: "in_app",
        recipient: "miniapp",
        status: "queued",
        error_message: null,
        sent_at: null,
        created_at: "2026-05-24T10:20:00Z",
        updated_at: "2026-05-24T10:20:00Z",
      },
    ],
  };

  async function handlePlatformLogin() {
    try {
      const openid = isWebHost ? "h5-demo-openid" : (await Taro.login()).code || "local-demo-openid";
      const payload: HotKeyAPI.MiniappLoginRequest = {
        provider: "wechat",
        openid,
        display_name: "HotKey 创作者",
      };
      Taro.setStorageSync(HOTKEY_TOKEN, `demo-token-${payload.openid}`);
      setIsLoggedIn(true);
      await Taro.showToast({
        title: isWebHost ? "H5 演示登录成功" : "登录成功",
        icon: "success",
      });
    } catch (error) {
      console.error(error);
      await Taro.showToast({
        title: "登录失败，请稍后重试",
        icon: "none",
      });
    }
  }

  function toggleFavorite(hotspotId: number) {
    setHotspots((items) => items.map((item) => (item.id === hotspotId ? { ...item, saved: !item.saved } : item)));
  }

  async function handleSubscribeMessage() {
    if (isWebHost) {
      await Taro.showToast({
        title: "H5 承载环境暂不支持订阅消息",
        icon: "none",
      });
      return;
    }

    try {
      await Taro.requestSubscribeMessage({
        entityIds: ["HOTKEY_TEMPLATE_ID"],
        tmplIds: ["HOTKEY_TEMPLATE_ID"],
      });
    } catch (error) {
      console.error(error);
      await Taro.showToast({
        title: "订阅失败，请稍后重试",
        icon: "none",
      });
    }
  }

  return (
    <View className="page">
      <View className="hero">
        <Text className="brand">HotKey</Text>
        <Text className="subtext">小程序轻量端：平台登录、热点榜单、快速理解、内容选题与收藏关注。</Text>
        <View className="actions">
          <Button className="button" onClick={handlePlatformLogin}>
            {isLoggedIn ? "已登录" : "平台登录"}
          </Button>
          <Button className="ghostButton" onClick={handleSubscribeMessage}>
            订阅消息提醒入口
          </Button>
        </View>
      </View>

      {isLoggedIn ? (
        <>
          <View className="panel">
            <Text className="title">热点榜单</Text>
            {hotspots.map((item, index) => (
              <View className={item.id === selectedHotspotId ? "hotspot hotspotActive" : "hotspot"} key={item.id}>
                <Text className="hotspotTitle" onClick={() => setSelectedHotspotId(item.id)}>
                  {index + 1}. {item.title}
                </Text>
                <Text className="summary">{item.snippet}</Text>
                <View className="meta">
                  <Text>{item.author}</Text>
                  <Text>热度 {item.trend_score}</Text>
                  <Text>排行 {item.rank_score}</Text>
                </View>
                <Button className="ghostButton" onClick={() => toggleFavorite(item.id)}>
                  {item.saved ? "已收藏关注" : "收藏关注"}
                </Button>
              </View>
            ))}
          </View>

          <View className="panel">
            <Text className="title">快速理解</Text>
            <Text className="detailTitle">{selected.title}</Text>
            <Text className="summary">{selected.ai_analysis?.summary ?? selected.snippet}</Text>
            {(selected.ai_analysis?.quick_understanding ?? [selected.snippet ?? "暂无 AI 摘要"]).map((item) => (
              <Text className="quickItem" key={item}>
                {item}
              </Text>
            ))}
          </View>

          <View className="panel">
            <Text className="title">内容选题</Text>
            {(selected.ai_analysis?.topic_ideas ?? topicIdeas).map((idea) => (
              <View className="idea" key={idea.title}>
                <Text className="ideaTitle">{idea.title}</Text>
                <Text className="ideaText">{idea.angle}</Text>
              </View>
            ))}
          </View>

          <View className="panel">
            <Text className="title">通知列表</Text>
            {notificationItems.items.map((item) => (
              <View className="idea" key={item.id}>
                <Text className="ideaTitle">{item.channel === "in_app" ? "站内提醒入口" : "邮件通知"}</Text>
                <Text className="ideaText">状态：{item.status}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View className="panel">
          <Text className="title">登录后查看热点榜单</Text>
          <Text className="summary">M3 优先打通平台登录到榜单、详情与收藏主链路。</Text>
        </View>
      )}
    </View>
  );
}
