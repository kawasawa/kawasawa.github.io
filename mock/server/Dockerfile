# ------------------------------------------------------------
# ビルド実行用ステージ
# ------------------------------------------------------------
# NOTE: コンテナ vs ハイパーバイザー
#
#               << Container >>                          << Hypervisor >>
#   +----------+ +----------+ +----------+    +----------+ +----------+ +----------+
#   |  Cont 1  | |  Cont 2  | |  Cont 3  |    |   VM 1   | |   VM 2   | |   VM 3   |
#   | +------+ | | +------+ | | +------+ |    | +------+ | | +------+ | | +------+ |
#   | | Apps | | | | Apps | | | | Apps | |    | | Apps | | | | Apps | | | | Apps | |
#   | +------+ | | +------+ | | +------+ |    | +------+ | | +------+ | | +------+ |
#   |          | |          | |          |    | | G OS | | | | G OS | | | | G OS | |
#   |          | |          | |          |    | +------+ | | +------+ | | +------+ |
#   |          | |          | |          |    | | V HW | | | | V HW | | | | V HW | |
#   |          | |          | |          |    | +------+ | | +------+ | | +------+ |
#   |          | |          | |          |    +----------+-+----------+-+----------+
#   |          | |          | |          |    |             Hypervisor             |
#   +----------+-+----------+-+----------+----+------------------------------------+
#   |                                      OS                                      |
#   +------------------------------------------------------------------------------+
#   |                                   HardWare                                   |
#   +------------------------------------------------------------------------------+
#
#   比較
#   - コンテナ
#       事例: Docker, Podman
#       概要: ホスト OS のカーネルを共有し、アプリケーションのみを隔離して実行する
#       起動速度: ◯ 高速
#       可搬性: ◯ 高い
#       拡張性: ◯ 高い
#       リソース消費: ◯ 小さい
#       隔離性: △ 中程度 (ホスト OS で発生した問題はコンテナにも波及する可能性がある)
#       そのほか: 環境差異が少ない、CI/CD や SaaS との親和性が高い、ランタイムの共存が可能 (複数 ver. の MySQL など)
#   - ハイパーバイザー
#       事例: VirtualBox, VMware, Hyper-V
#       概要: 仮想ハードウェアを作成し OS を完全にエミュレートする
#       起動速度: × 低速 (OS を起動するため時間がかかる)
#       可搬性: × 低い (OS を丸ごと持ち運ぶためイメージサイズが巨大になる)
#       拡張性: × 低い (都度 HW と OS を用意する必要があり拡張性には限界がある)
#       リソース消費: × 大きい (VM ごとに OS カーネルやドライバーを持つためリソース消費が大きい)
#       隔離性: ◯ 高い
#       そのほか: レガシー OS を安全に起動可能 (XP や Vista 等も扱える)、ホスト OS 無しでの起動も可能
#   補足
#     コンテナとハイパーバイザーは完全に対立する技術ではなく、既存のサービスでも両者を組み合わせて実現されているものが多い
#     例えば Docker Desktop は Linux の仮想マシンを起動し、その上で Docker コンテナを実行している
#     そのほか AWS ECS の Fargate も Firecracker microVM という軽量な仮想マシン上でコンテナが動いている
# ------------------------------------------------------------

FROM node:18.14.2-bullseye-slim AS build

WORKDIR /usr/src/app

#COPY ["package.json", "yarn.lock", ".yarnrc", "./"]
COPY ["package.json", "./"]
# tsconfig.json の設定を反映させるため typescript が含まれる devDependencies もインストールする
#RUN yarn install --production
RUN yarn install

COPY ["prisma/", "./"]
RUN yarn gen:db:client

# 今回は開発用サーバを起動するためビルドは不要
#COPY . .
#RUN yarn build


# ------------------------------------------------------------
# イメージ生成用ステージ
# ------------------------------------------------------------
# このステージが最終であり、成果物がイメージとして生成される
# ここまででビルドは完了しているため、このステージでは実行さえできれば良い
#
# NOTE: Docker のベースイメージは極力軽量なものを選ぶと良い
# - BusyBox
#     容量: 極小 (1~10 MB 程度)
#     概要: 最小限の UNIX ツールのみで構成され、単一バイナリで動作する最小の Linux
#     用途: 組み込みシステム
#     補足: サーバと言うよりツール群に近い
# - Alpine (BusyBox がベース)
#     容量: 小規模 (10~30 MB 程度)
#     概要: apk や musl 等を追加し最小限のサーバ環境を構成した軽量 Linux
#     用途: マイクロサービス, 軽量サーバ
# - Debian (Alpine がベース)
#     容量: 中規模 (50~300 MB 程度)
#     概要: フル機能の GNU ツール等を追加された多機能 Linux
#     用途: 一般的な Linux サーバ
#     補足: v10=buster, v11=bullseye
# - Ubuntu (Debian がベース)
#     容量: 大規模 (2~4 GB 程度)
#     概要: GUI 及びデバイスドライバーまでサポートを拡充した大型 Linux
#     用途: GUI 環境
# - Distroless (Debian がベース)
#     容量: 小規模 (10~30 MB 程度)
#     概要: アプリの実行に必要な最小限のパッケージのみを抽出した Google 製の軽量 Linux
#     用途: セキュリティ要件の高いサーバ
#     補足: シェルも取り除かれているためデバッグは困難だが、攻撃点も少なく非常に強固で軽量
# - ※ Slim (これは正確には OS ではなくタグ)
#     概要: 指定の OS について同梱パッケージを使用頻度の高いものに限定した軽量版
#     補足: 容量が削減される代わりに、アプリの実行に必要なパッケージが足りない場合もあり、動作検証が必要
# ------------------------------------------------------------

FROM node:18.14.2-alpine AS runtime

#ENV NODE_ENV production

# 既定のアプリケーション配置用ディレクトリをワークとして使用する
#
# NOTE: Linux では既定ディレクトリとして下記の使用を推奨している
#   - /usr/src/app: アプリケーションの配置
#   - /usr/local  : ツールやライブラリの配置
WORKDIR /usr/src/app

# rootless モードとして実行する
USER node

# パッケージとソースファイルを複製し root 権限を剥奪する
# yarn スクリプトを使用する場合は package.json も追加する
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json

#ENTRYPOINT ["yarn", "start"]

# 開発用サーバを起動するためソースをそのまま持ってきて実行する
COPY --chown=node:node . .
ENTRYPOINT ["yarn", "dev"]
