
// function for create and return pagination array start ------------
const getPaginationData = (page, totalrows, currentLimit) => {

    const countLoop = Math.ceil(totalrows / currentLimit)
    const pageArray = []

    pageArray.push({
        label: "Prev",
        value:(page === 1) ? 1 : page - 1,
        disabled:(page === 1),
        isNav:"true",
        active:false
    })

    if (page >= 2) {

        if (page === countLoop && countLoop >= 3) {
            pageArray.push({
                label:page - 2,
                value:page - 2,
                disabled:false,
                active:false
            })
        }

        pageArray.push({
            label:page - 1,
            value:page - 1,
            disabled:false,
            active:false
        })
    }

    pageArray.push({
        label:page,
        value:page,
        disabled:true,
        active:true
    })

    if (page < countLoop) {
        if ((countLoop - page) >= 1) {
            pageArray.push({
                label:page + 1,
                value:page + 1,
                disabled:false,
                active:false
            })
        }      
        if (page === 1 && countLoop >= 3) {
            pageArray.push({
                label:page + 2,
                value:page + 2,
                disabled:false,
                active:false
            })
        }
    }

    pageArray.push({
        label:'Next',
        value:(page === countLoop) ? countLoop : page + 1,
        disabled:(page === countLoop),
        isNav:"true",
        active:false
    })

    return pageArray

}
// ------------

export {
    getPaginationData
}