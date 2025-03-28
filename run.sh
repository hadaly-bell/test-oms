
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}注文管理システム (OMS) バックエンド${NC}"
echo -e "${YELLOW}============================${NC}"

case "$1" in
  build)
    echo -e "${GREEN}Dockerイメージをビルドしています...${NC}"
    docker-compose build
    ;;
  up)
    echo -e "${GREEN}コンテナを起動しています...${NC}"
    docker-compose up -d
    echo -e "${GREEN}コンテナが起動しました！${NC}"
    echo -e "APIは http://localhost:3000/api/v1/ でアクセスできます"
    ;;
  down)
    echo -e "${GREEN}コンテナを停止しています...${NC}"
    docker-compose down
    ;;
  logs)
    echo -e "${GREEN}ログを表示しています...${NC}"
    docker-compose logs -f
    ;;
  setup)
    echo -e "${GREEN}データベースをセットアップしています...${NC}"
    docker-compose run --rm web rails db:create db:migrate db:seed
    ;;
  bash)
    echo -e "${GREEN}コンテナ内のbashを起動しています...${NC}"
    docker-compose run --rm web bash
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
    echo "./run.sh build    # Dockerイメージをビルド"
    echo "./run.sh up       # コンテナを起動"
    echo "./run.sh down     # コンテナを停止"
    echo "./run.sh logs     # ログを表示"
    echo "./run.sh setup    # データベースをセットアップ"
    echo "./run.sh bash     # コンテナ内でbashを実行"
    echo "./run.sh test     # APIエンドポイントをテスト"
    ;;
esac
