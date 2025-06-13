export function createBoard (rows, cols, bombs) {
  const board = Array.from({ length: rows }, () => Array(cols).fill(0))

  // Plantar bombas
  let planted = 0
  while (planted < bombs) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (board[r][c] === 'B') continue
    board[r][c] = 'B'
    planted++
  }

  // Calcular números
  const directions = [-1, 0, 1]
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 'B') continue
      let count = 0
      for (const dr of directions) {
        for (const dc of directions) {
          if (dr === 0 && dc === 0) continue
          const nr = r + dr; const nc = c + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === 'B') {
            count++
          }
        }
      }
      board[r][c] = count
    }
  }

  return board
}
