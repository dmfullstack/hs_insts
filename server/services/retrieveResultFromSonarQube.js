const request = require('superagent');
const config = require('../config');

function retrieveResultFromSonarQube(commitId, done) {
  const url = `${config.sonarQubeServerUrl}/api/measures/component?additionalFields=periods&componentKey=${commitId}&metricKeys=new_technical_debt%2Cblocker_violations%2Cbugs%2Cburned_budget%2Cbusiness_value%2Cclasses%2Ccode_smells%2Ccognitive_complexity%2Ccomment_lines%2Ccomment_lines_density%2Ccomplexity%2Cclass_complexity%2Cfile_complexity%2Cfunction_complexity%2Cbranch_coverage%2Cnew_branch_coverage%2Cconfirmed_issues%2Ccoverage%2Cnew_coverage%2Ccritical_violations%2Cdirectories%2Cduplicated_blocks%2Cnew_duplicated_blocks%2Cduplicated_files%2Cduplicated_lines%2Cduplicated_lines_density%2Cnew_duplicated_lines%2Cnew_duplicated_lines_density%2Ceffort_to_reach_maintainability_rating_a%2Cfalse_positive_issues%2Cfiles%2Cfunctions%2Cgenerated_lines%2Cgenerated_ncloc%2Cinfo_violations%2Cviolations%2Cline_coverage%2Cnew_line_coverage%2Clines%2Cncloc%2Cnew_lines%2Clines_to_cover%2Cnew_lines_to_cover%2Csqale_rating%2Cnew_maintainability_rating%2Cmajor_violations%2Cminor_violations%2Cnew_blocker_violations%2Cnew_bugs%2Cnew_code_smells%2Cnew_critical_violations%2Cnew_info_violations%2Cnew_violations%2Cnew_major_violations%2Cnew_minor_violations%2Cnew_vulnerabilities%2Copen_issues%2Cprojects%2Calert_status%2Creliability_rating%2Cnew_reliability_rating%2Creliability_remediation_effort%2Cnew_reliability_remediation_effort%2Creopened_issues%2Csecurity_rating%2Cnew_security_rating%2Csecurity_remediation_effort%2Cnew_security_remediation_effort%2Cskipped_tests%2Cstatements%2Cteam_size%2Csqale_index%2Csqale_debt_ratio%2Cnew_sqale_debt_ratio%2Cuncovered_conditions%2Cnew_uncovered_conditions%2Cuncovered_lines%2Cnew_uncovered_lines%2Ctest_execution_time%2Ctest_errors%2Ctest_failures%2Ctest_success_density%2Ctests%2Cvulnerabilities%2Cwont_fix_issues`;
  request
    .get(url)
    .end((err, res) => {
      if(err) { done(err); return; }
      console.log('res.status:', res.status);
      if(res.status === 404) { done(null, false); }
      done(err, res.body);
    });
}

module.exports = retrieveResultFromSonarQube;
