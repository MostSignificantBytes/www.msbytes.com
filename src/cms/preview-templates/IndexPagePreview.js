import PropTypes from 'prop-types'
import { IndexPageTemplate } from '../../templates/index-page'

const IndexPagePreview = ({ entry, getAsset }) => {
    const data = entry.getIn(['data']).toJS()

    if (data) {
        const intro = data.intro || { blurbs: [] }
        const blurbs = (intro.blurbs || []).map((blurb) => ({ ...blurb, image: blurb.image && getAsset(blurb.image) }))
        return (
            <IndexPageTemplate
                preview
                language={data.language}
                image={getAsset(data.image)}
                title={data.title}
                heading={data.heading}
                intro={{ ...intro, blurbs }}
                mainpitch={data.mainpitch || {}}
                seeAllActivities={data.seeAllActivities}
                latestStories={data.latestStories}
                keepReading={data.keepReading}
                ourBlog={data.ourBlog}
            />
        )
    } else {
        return <div>Loading...</div>
    }
}

IndexPagePreview.propTypes = {
    entry: PropTypes.shape({
        getIn: PropTypes.func,
    }),
    getAsset: PropTypes.func,
}

export default IndexPagePreview
