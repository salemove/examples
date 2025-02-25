@Library('pipeline-lib') _

stage('Check WFM integration example') {
  withResultReporting(slackChannel: '#tm-cerebro') {
    inPod(containers: [
      interactiveContainer(name: 'ruby', image: 'public.ecr.aws/docker/library/ruby:2.6.7')
    ]) {
      checkout(scm)
      container('ruby') {
        dir('rest_api/ruby/wfm_integration') {
          sh('''\
            gem install bundler -v '2.0.2'
            bin/bundle install
            bin/rubocop
            bin/rspec
          '''.stripIndent())
        }
      }
    }
  }
}
