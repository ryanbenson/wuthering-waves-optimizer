.PHONY: help install generate-character character cli

help:
	@echo "Wuthering Waves Optimizer"
	@echo ""
	@echo "Usage:"
	@echo "  make install              Install npm dependencies"
	@echo "  make generate-character   Interactive character scaffold generator"
	@echo "  make character            Alias for generate-character"
	@echo ""
	@echo "Equivalent npm command:"
	@echo "  npm run cli -- generate character"

install:
	npm install

generate-character: cli

character: generate-character

cli:
	npm run cli -- generate character
