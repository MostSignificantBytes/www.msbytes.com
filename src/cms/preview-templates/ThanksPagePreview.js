import PropTypes from 'prop-types'
import { ThanksPageTemplate } from '../../templates/thanks-page'

const ThanksPagePreview = ({ entry }) => (
    <ThanksPageTemplate
        title={entry.getIn(['data', 'title'])}
        text={entry.getIn(['data', 'text'])}
    />
)

ThanksPagePreview.propTypes = {
    entry: PropTypes.shape({
        getIn: PropTypes.func,
    }),
}

export default ThanksPagePreview
