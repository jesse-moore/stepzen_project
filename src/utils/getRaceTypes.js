const getRaceTypes = (races) => {
    if (!races || !Array.isArray(races)) return []
    const sortTable = {
        '5k': 1,
        '10k': 2,
        'Half Marathon': 3,
        Marathon: 4,
        '50k': 5,
    }
    return races
        .map((race) => {
            return race.type
        })
        .sort((a, b) => {
            return sortTable[a] > sortTable[b] ? 1 : -1
        })
}

export default getRaceTypes
