from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class MiniappTaroContractTests(unittest.TestCase):
    def read_text(self, relative_path: str) -> str:
        return (ROOT / relative_path).read_text(encoding="utf-8")

    def test_taro_react_typescript_project_files_exist(self) -> None:
        package_json = json.loads(self.read_text("package.json"))
        dependencies = {**package_json.get("dependencies", {}), **package_json.get("devDependencies", {})}

        for package_name in [
            "@tarojs/taro",
            "@tarojs/components",
            "@tarojs/cli",
            "@tarojs/plugin-platform-h5",
            "@tarojs/webpack5-runner",
            "react",
            "react-dom",
        ]:
            self.assertIn(package_name, dependencies)

        self.assertEqual(package_json["scripts"]["build:weapp"], "taro build --type weapp")
        self.assertEqual(package_json["scripts"]["build:h5"], "taro build --type h5")

        for relative_path in [
            "config/index.ts",
            "project.config.json",
            "src/app.tsx",
            "src/app.config.ts",
            "src/app.scss",
            "src/index.html",
            "src/pages/index/index.tsx",
            "src/pages/index/index.config.ts",
            "src/pages/index/index.scss",
        ]:
            self.assertTrue((ROOT / relative_path).exists(), f"{relative_path} is required")

    def test_miniapp_main_chain_contains_login_ranking_detail_and_favorite(self) -> None:
        index_page = self.read_text("src/pages/index/index.tsx")

        for expected in [
            "Taro.login",
            "HotKeyAPI.MiniappLoginRequest",
            "Taro.getEnv() === Taro.ENV_TYPE.WEB",
            "热点榜单",
            "快速理解",
            "收藏关注",
            "toggleFavorite",
            "selectedHotspotId",
            "内容选题",
            "Taro.showToast",
            "H5 承载环境暂不支持订阅消息",
        ]:
            self.assertIn(expected, index_page)

    def test_request_adapter_uses_taro_request_and_token_storage(self) -> None:
        request_adapter = self.read_text("src/utils/request.ts")

        self.assertIn("Taro.request", request_adapter)
        self.assertIn("Taro.getStorageSync", request_adapter)
        self.assertIn("Authorization", request_adapter)
        self.assertIn("HOTKEY_TOKEN", request_adapter)
        self.assertIn("class HotKeyAPIError extends Error", request_adapter)
        self.assertIn("payload.code", request_adapter.replace("data.code", "payload.code"))
        self.assertIn("isAPIErrorPayload", request_adapter)


if __name__ == "__main__":
    unittest.main()
