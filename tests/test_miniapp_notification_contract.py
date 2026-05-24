from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class MiniappNotificationContractTests(unittest.TestCase):
    def read_text(self, relative_path: str) -> str:
        return (ROOT / relative_path).read_text(encoding="utf-8")

    def test_generated_client_contains_notification_list_response(self) -> None:
        typings = self.read_text("src/services/hotkey/hotkey-server/typings.d.ts")

        self.assertIn("NotificationRead", typings)
        self.assertIn("NotificationListResponse", typings)
        self.assertIn("listNotificationsApiNotificationsGet", self.read_text("src/services/hotkey/hotkey-server/notifications.ts"))

    def test_miniapp_page_reserves_subscription_notification_entry(self) -> None:
        page = self.read_text("src/pages/index/index.tsx")

        self.assertIn("notificationItems", page)
        self.assertIn("NotificationListResponse", page)
        self.assertIn("订阅消息", page)
        self.assertIn("提醒入口", page)
        self.assertIn("requestSubscribeMessage", page)


if __name__ == "__main__":
    unittest.main()
