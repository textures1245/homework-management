export class Teammate {
  constructor(
    public tm_id: number,
    public prefixName: string[],
    public name: string[],
    public assigned: string[],
    public done_status: number[],
    public tm_code: string[]
  ) {}
}
