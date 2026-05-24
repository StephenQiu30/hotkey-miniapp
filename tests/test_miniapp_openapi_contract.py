from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class MiniappOpenAPIContractTests(unittest.TestCase):
    def read_text(self, relative_path: str) -> str:
        return (ROOT / relative_path).read_text(encoding="utf-8")

    def test_openapi_generation_config_uses_server_swagger_source(self) -> None:
        package_json = json.loads(self.read_text("package.json"))
        dependencies = {**package_json.get("dependencies", {}), **package_json.get("devDependencies", {})}

        self.assertIn("@umijs/openapi", dependencies)
        self.assertEqual(package_json["scripts"]["openapi:generate"], "openapi2ts")

        config = self.read_text("openapi2ts.config.ts")
        self.assertIn("../hotkey-server/docs/openapi.json", config)
        self.assertIn("src/services/hotkey", config)
        self.assertIn("HotKeyAPI", config)
        self.assertIn("@/utils/request", config)

    def test_generated_client_contains_m3_server_contract_fields(self) -> None:
        typings = self.read_text("src/services/hotkey/hotkey-server/typings.d.ts")

        for expected in [
            "MiniappLoginRequest",
            "EmailLoginRequest",
            "HotspotRead",
            "AiAnalysisRead",
            "quick_understanding",
            "topic_ideas",
            "rank_score",
            "trend_score",
            "cluster_id",
        ]:
            self.assertIn(expected, typings)


if __name__ == "__main__":
    unittest.main()
