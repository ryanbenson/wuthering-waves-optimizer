.PHONY: help install generate-character character generate-weapon weapon cli import-echoes

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
	@echo "  make import-echoes       Import echoes from Encore API"
	@echo ""
	@echo "Equivalent npm commands:"
	@echo "  npm run cli -- generate character"
	@echo "  npm run cli -- generate weapon"
	@echo "  npm run cli -- import echoes"

install:
	npm install

generate-character: cli-character

character: generate-character

generate-weapon: cli-weapon

weapon: generate-weapon

cli-character:
	npm run cli -- generate character $(ARGS)

cli-weapon:
	npm run cli -- generate weapon

cli: cli-character

import-echoes:
	npm run cli -- import echoes
