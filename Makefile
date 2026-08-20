.PHONY: help install generate-character character generate-weapon weapon generate-echo-preset echo-preset generate-enemies enemies cli import-echoes

help:
	@echo "Wuthering Waves Optimizer"
	@echo ""
	@echo "Usage:"
	@echo "  make install              Install npm dependencies"
	@echo "  make generate-character   Interactive character scaffold generator"
	@echo "  make generate-character ARGS=\"--merge-modifiers\"  Regenerate while keeping entry properties"
	@echo "  make character            Alias for generate-character"
	@echo "  make generate-weapon      Interactive weapon scaffold generator"
	@echo "  make weapon               Alias for generate-weapon"
	@echo "  make generate-echo-preset Interactive echo preset generator"
	@echo "  make echo-preset          Alias for generate-echo-preset"
	@echo "  make generate-enemies     Generate src/enemies/index.ts from the Encore API"
	@echo "  make generate-enemies ARGS=\"--mode fill\"       Skip the prompt, fill in missing enemies only"
	@echo "  make generate-enemies ARGS=\"--mode overwrite\"  Skip the prompt, rebuild every enemy"
	@echo "  make enemies              Alias for generate-enemies"
	@echo "  make import-echoes        Import echoes from Encore API"
	@echo ""
	@echo "Equivalent npm commands:"
	@echo "  npm run cli -- generate character"
	@echo "  npm run cli -- generate weapon"
	@echo "  npm run cli -- generate echo-preset"
	@echo "  npm run cli -- generate enemies"
	@echo "  npm run cli -- import echoes"

install:
	npm install

generate-character: cli-character

character: generate-character

generate-weapon: cli-weapon

weapon: generate-weapon

generate-echo-preset: cli-echo-preset

echo-preset: generate-echo-preset

generate-enemies: cli-enemies

enemies: generate-enemies

cli-character:
	npm run cli -- generate character $(ARGS)

cli-weapon:
	npm run cli -- generate weapon

cli-echo-preset:
	npm run cli -- generate echo-preset

cli-enemies:
	npm run cli -- generate enemies $(ARGS)

cli: cli-character

import-echoes:
	npm run cli -- import echoes
