import './Node.css'
export default function PathFinder(props) {
    const {
        col,
        isFinish,
        isStart,
        isWall,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
        row,
        onClick
      } = props;
      const extraClassName = isFinish
        ? 'node-finish'
        : isStart
        ? 'node-start'
        : isWall
        ? 'node-wall'
        : '';
  
    return <div
    id={`node-${row}-${col}`}
    className={`node ${extraClassName}`}
    onClick={()=> onClick(row,col) }
    onMouseDown={() => onMouseDown(row, col)}
    onMouseEnter={() => onMouseEnter(row, col)}
    onMouseUp={() => onMouseUp()}></div>
}