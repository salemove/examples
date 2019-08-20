@Library('pipeline-lib') _

stage('Check WFM integration example') {
  withResultReporting(slackChannel: '#tm-prism') {
    inPod(containers: [
      interactiveContainer(name: 'ruby', image: 'ruby:2.6.3')
    ]) {
      checkout(scm)
      container('ruby') {
        dir('rest_api/ruby/wfm_integration') {
          sh('''\
            gem install bundler -v '2.0.1'
            bin/bundle install
            bin/rubocop
          '''.stripIndent())
        }
      }
    }
  }
}
