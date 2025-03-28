

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}注文管理システム (OMS) バックエンド${NC}"
echo -e "${YELLOW}============================${NC}"

case "$1" in
  start)
    echo -e "${GREEN}Railsサーバーを起動しています...${NC}"
    bundle install
    rails db:migrate
    rails db:seed 2>/dev/null || echo "シードデータは既に存在します"
    rails server -b 0.0.0.0
    ;;
  stop)
    echo -e "${GREEN}Railsサーバーを停止しています...${NC}"
    kill -9 $(lsof -t -i:3000) 2>/dev/null || echo "サーバーは既に停止しています"
    ;;
  setup)
    echo -e "${GREEN}データベースをセットアップしています...${NC}"
    bundle install
    rails db:create
    rails db:migrate
    rails db:seed 2>/dev/null || echo "シードデータは既に存在します"
    ;;
  test)
    echo -e "${GREEN}APIエンドポイントをテストしています...${NC}"
    
    echo -e "\n${YELLOW}Partners API テスト:${NC}"
    echo "GET /api/v1/partners"
    curl -s http://localhost:3000/api/v1/partners | jq '.' || echo "Error: jqがインストールされていない場合は生のJSONが表示されます"
    
    echo -e "\n${YELLOW}Orders API テスト:${NC}"
    echo "GET /api/v1/orders"
    curl -s http://localhost:3000/api/v1/orders | jq '.' || echo "Error: jqがインストールされていない場合は生のJSONが表示されます"
    
    echo -e "\n${YELLOW}Users API テスト:${NC}"
    echo "GET /api/v1/users"
    curl -s http://localhost:3000/api/v1/users | jq '.' || echo "Error: jqがインストールされていない場合は生のJSONが表示されます"
    ;;
  *)
    echo -e "${YELLOW}使用方法:${NC}"
    echo "./run.sh start    # Railsサーバーを起動"
    echo "./run.sh stop     # Railsサーバーを停止"
    echo "./run.sh setup    # データベースをセットアップ"
    echo "./run.sh test     # APIエンドポイントをテスト"
    ;;
esac
