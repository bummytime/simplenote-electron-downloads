const apiEndpoint = 'https://api.github.com/repos/automattic/simplenote-electron/releases';

const SimplenoteDownload = React.createClass( {
	getDefaultProps: function() {
		return {
			appData: {
				name: '',
				download_count: 0
			}
		};
	},

	render: function() {
		const { name } = this.props.appData;
		var platform;
		if ( name.indexOf( 'mac' ) > -1 ) {
			platform = 'osx';
		} else if ( name.indexOf( 'linux' ) > -1 ) {
			platform = 'linux';
		} else {
			platform = 'windows';
		}

		const imageSrc = `images/${platform}.png`;

		return (
			<div className="simplenote-app">
				<img src={ imageSrc } />
				<div className="title">{ this.props.appData.name }</div>
				<div className="downloads">{ this.props.appData.download_count.toLocaleString() }</div>
			</div>
		);
	}
});

const App = React.createClass({

	getInitialState: function() {
		return {
			currentApiData: [],
			currentVersionName: '',
			previousApiData: [],
			previousVersionName: '',
			previouspreviousApiData: [],
			previouspreviousVersionName: ''
		}
	},

	componentDidMount: function() {
		this.fetchDownloadCounts();
	},

	fetchDownloadCounts: function() {
		this.serverRequest = $.get( apiEndpoint, function( result ) {
	      this.setState( {
	        currentApiData: result[ 0 ][ 'assets' ],
	        currentVersionName: result[ 0 ].name,
	        previousApiData: result[ 1 ][ 'assets' ],
	        previousVersionName: result[ 1 ].name,
	        previouspreviousApiData: result[ 2 ][ 'assets' ],
	        previouspreviousVersionName: result[ 2 ].name
	      }, this.queueDataFetch );
	    }.bind( this ) );
	},

	queueDataFetch: function() {
		setTimeout( this.fetchDownloadCounts, 30000 );
	},

	render: function() {
		return (
			<div className="app">
				<img className="simplenote-logo" src="images/icon.png" />
				<div className="greetz">Download Counts</div>
				<div className="version-name">{ this.state.currentVersionName }</div>
				<div className="simplenote-apps">
					{this.state.currentApiData.map( ( appData, key ) => {
						return (
							<SimplenoteDownload appData={ appData } key={ key } />
						);
					} )}
				</div>
				<div className="striped-border">
				<div className="version-name">{ this.state.previousVersionName }</div>
				<div className="simplenote-apps">
					{this.state.previousApiData.map( ( appData, key ) => {
						return (
							<SimplenoteDownload appData={ appData } key={ key } />
						);
					} )}
				</div>
				<div className="striped-border">
				<div className="version-name">{ this.state.previouspreviousVersionName }</div>
				<div className="simplenote-apps">
					{this.state.previouspreviousApiData.map( ( appData, key ) => {
						return (
							<SimplenoteDownload appData={ appData } key={ key } />
						);
					} )}
				</div>
			</div>
		);
	}
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
