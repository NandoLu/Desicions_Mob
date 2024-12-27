// GameLogic.ts

interface GameState {
    currentMonth: string;
    currentYear: number;
  }
  
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  
  export const initializeGameState = (startingYear: number): GameState => {
    return {
      currentMonth: "Janeiro",
      currentYear: startingYear,
    };
  };
  
  export const advanceTurn = (state: GameState): GameState => {
    const currentMonthIndex = months.indexOf(state.currentMonth);
    const isDecember = currentMonthIndex === 11;
  
    return {
      currentMonth: isDecember ? "Janeiro" : months[currentMonthIndex + 1],
      currentYear: isDecember ? state.currentYear + 1 : state.currentYear,
    };
  };
  