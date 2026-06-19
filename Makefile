.PHONY: help install generate-character character generate-weapon weapon cli

help:
	@echo "Wuthering Waves Optimizer"
	@echo ""
	@echo "Usage:"
	@echo "  make install              Install npm dependencies"
	@echo "  make generate-character   Interactive character scaffold generator"
	@echo "  make character            Alias for generate-character"
	@echo "  make generate-weapon      Interactive weapon scaffold generator"
	@echo "  make weapon               Alias for generate-weapon"
	@echo ""
	@echo "Equivalent npm commands:"
	@echo "  npm run cli -- generate character"
	@echo "  npm run cli -- generate weapon"

install:
	npm install

generate-character: cli-character

character: generate-character

generate-weapon: cli-weapon

weapon: generate-weapon

cli-character:
	npm run cli -- generate character

cli-weapon:
	npm run cli -- generate weapon

cli: cli-character
