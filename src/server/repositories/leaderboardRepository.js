// 备注：对应培训阶段 6（代码重构），关联设计文档第 5 节“架构设计”中的 Repository 抽象。
export class LeaderboardRepository {
  async list() {
    throw new Error('LeaderboardRepository.list 必须由子类实现。');
  }

  async getById() {
    throw new Error('LeaderboardRepository.getById 必须由子类实现。');
  }

  async create() {
    throw new Error('LeaderboardRepository.create 必须由子类实现。');
  }

  async update() {
    throw new Error('LeaderboardRepository.update 必须由子类实现。');
  }

  async delete() {
    throw new Error('LeaderboardRepository.delete 必须由子类实现。');
  }
}
