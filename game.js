import chalk from 'chalk';
import readlineSync from 'readline-sync';
//chcp 65001

class Player {
  constructor() {
    this.hp = 100;
    this.maxhp = 100;
    this.attackpower = 20;
  }

  attack(monster) {
    // 플레이어의 공격
    const damage = Math.floor(Math.random() * this.attackpower) + 15;
    monster.hp -= damage;
    return damage;
  }

  Buff() {
    const hpincrease = Math.floor(Math.random() * 50)
    const attackincrease = Math.floor(Math.random() * 15)
    this.hp += 75;
    this.maxhp += hpincrease
    this.attackpower += attackincrease
    if (this.hp > this.maxhp) {
      this.hp = this.maxhp;  // hp가 maxhp를 넘지 않도록 설정
    }
    console.log(chalk.green(`플레이어가 강력해졌습니다! 최대 체력${hpincrease}과 공격력${attackincrease}이 증가했습니다.`));
    console.log(chalk.green(`플레이어가 체력 75을 회복하였습니다.`))
    readlineSync.question('\n계속하려면 엔터 키를 누르세요.');
  }
}


class Monster {
  constructor(stage) {
    this.hp = 100 + stage * 10;
    this.maxhp = 100 + stage * 10;
    this.attackpower = 15 + stage * 2;
  }

  attack(player) {
    // 몬스터의 공격
    const damage = Math.floor(Math.random() * this.attackpower) + 3;
    player.hp -= damage;
    return damage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} |`) +
    chalk.blueBright(
      `\n| 플레이어 정보 | 체력 : ${player.hp} / ${player.maxhp} | 공격력 : ${player.attackpower} `,
    ) +
    chalk.redBright(
      `\n| 몬스터 정보 | 체력 : ${monster.hp} / ${monster.maxhp} | 공격력 : ${monster.attackpower}`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0 && monster.hp > 0) { // 몬스터가 살아 있는 동안 계속 싸움
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 도망간다.(20%)`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    if (choice === "1") {
      const playerDamage = player.attack(monster);
      logs.push(chalk.green(`플레이어가 ${playerDamage}의 데미지를 입혔습니다.`));

      if (monster.hp >= 0) {
        const monsterDamage = monster.attack(player);
        logs.push(chalk.red(`몬스터가 ${monsterDamage}의 데미지를 입혔습니다.`));
      } else {
        logs.push(chalk.blue(`몬스터를 처치했습니다!`));
      }
    }

    if (choice === "2") {
      if (Math.random() < 0.3) {
        console.log(chalk.yellow(`도망에 성공했습니다!`));
        readlineSync.question('\n다음 스테이지로 넘어가려면 엔터 키를 누르세요.')
        break;
      } else {
        logs.push(chalk.yellow(`도망에 실패했습니다 ㅠㅠ`));
        const monsterDamage = monster.attack(player);
        logs.push(chalk.red(`몬스터가 ${monsterDamage}의 데미지를 입혔습니다.`));
      }
    }

    if (player.hp <= 0) {
      console.log(chalk.redBright(`플레이어가 사망했습니다...`));
      break;
    }

    console.clear(); // 매 턴 후에 콘솔을 지워 화면을 새로고침
  }


};

export async function startGame() {
  console.clear();
  let stage = 1;
  const player = new Player(stage); // 플레이어는 처음 시작할 때만 생성

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    if (player.hp <= 0) {
      console.log(chalk.red(`게 임 오 버`));
      break;
    }

    if (monster.hp <= 0) {
      console.log(chalk.blueBright(`스테이지 ${stage} 클리어!`));
      player.Buff();
    }

    stage++; // 스테이지 클리어 후 스테이지 증가
  }

  if (player.hp > 0) {
    console.log(chalk.blueBright(`모 든 스 테 이 지 클 리 어 !`));
  }
}
