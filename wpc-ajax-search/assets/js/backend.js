'use strict';

(function($) {
  $(function() {
    wpcas_settings();
    wpcas_source_init();
    wpcas_build_label();
    wpcas_terms_init();
    wpcas_enhanced_select();
    wpcas_condition_init();
    wpcas_condition_tags_init();
    wpcas_combined_init();
    wpcas_combined_terms_init();
    wpcas_returned_init();
    wpcas_sortable();
  });

  $(document).on('change', '.wpcas_animated_placeholder', function(e) {
    wpcas_settings();
  });

  $(document).on('change', '.wpcas_condition_compare_selector', function(e) {
    wpcas_condition_init();
  });

  $(document).on('change', '.wpcas_returned_selector', function(e) {
    var $this = $(this);
    var $rule = $this.closest('.wpcas_rule');

    wpcas_build_label($rule);
    wpcas_returned_init($rule);
  });

  $(document).on('change', '.wpcas_source_selector', function() {
    var $this = $(this);
    var $rule = $this.closest('.wpcas_rule');

    wpcas_source_init($rule);
    wpcas_terms_init();
  });

  $(document).on('change keyup', '.wpcas_rule_name_val', function() {
    var name = $(this).val();
    var key = $(this).closest('.wpcas_rule').data('key');
    var displayName = name.trim() !== '' ? name.replace(/(<([^>]+)>)/ig, '') : '#' + key;

    $(this).
        closest('.wpcas_rule').
        find('.wpcas_rule_name').
        html(displayName);
  });

  $(document).on('change', '.wpcas_terms', function() {
    var $this = $(this);
    var apply = $(this).
        closest('.wpcas_rule').
        find('.wpcas_source_selector').
        val();

    $this.data(apply, $this.val().join());
  });

  $(document).on('click touch', '.wpcas_condition_remove', function() {
    $(this).closest('.wpcas_condition').remove();
  });

  $(document).on('change', '.wpcas_combined_selector', function() {
    wpcas_combined_init();
    wpcas_combined_terms_init();
  });

  $(document).on('click touch', '.wpcas_combined_remove', function() {
    $(this).closest('.wpcas_combined').remove();
  });

  $(document).on('click touch', '.wpcas_rule_heading', function(e) {
    if ($(e.target).closest('.wpcas_rule_remove').length === 0 && $(e.target).closest('.wpcas_rule_summary').length === 0) {
      $(this).closest('.wpcas_rule').toggleClass('active');
    }
  });

  $(document).on('click touch', '.wpcas_new_condition', function(e) {
    var $conditions = $(this).
        closest('.wpcas_tr').
        find('.wpcas_conditions');
    var key = $(this).
        closest('.wpcas_rule').data('key');
    var data = {
      action: 'wpcas_add_condition',
      nonce: wpcas_vars.wpcas_nonce,
      key: key,
    };

    $.post(ajaxurl, data, function(response) {
      $conditions.append(response);
      wpcas_condition_init();
      wpcas_condition_tags_init();
    });

    e.preventDefault();
  });

  $(document).on('click touch', '.wpcas_new_combined', function(e) {
    var $combination = $(this).
        closest('.wpcas_tr').
        find('.wpcas_combination');
    var key = $(this).
        closest('.wpcas_rule').data('key');
    var data = {
      action: 'wpcas_add_combined',
      nonce: wpcas_vars.wpcas_nonce,
      key: key,
    };

    $.post(ajaxurl, data, function(response) {
      $combination.append(response);
      wpcas_combined_init();
      wpcas_combined_terms_init();
    });

    e.preventDefault();
  });

  $(document).on('click touch', '.wpcas_new_rule', function(e) {
    e.preventDefault();
    $('.wpcas_rules').addClass('wpcas_rules_loading');

    var data = {
      action: 'wpcas_add_rule', nonce: wpcas_vars.wpcas_nonce,
    };

    $.post(ajaxurl, data, function(response) {
      var $rule = $(response);
      $('.wpcas_rules').append($rule);
      wpcas_source_init($rule);
      wpcas_build_label($rule);
      wpcas_init_editor($rule);
      wpcas_terms_init();
      wpcas_enhanced_select();
      wpcas_condition_init();
      wpcas_condition_tags_init();
      wpcas_combined_init();
      wpcas_combined_terms_init();
      wpcas_returned_init($rule);
      $('.wpcas_rules').removeClass('wpcas_rules_loading');
    });
  });

  $(document).on('click touch', '.wpcas_rule_remove', function(e) {
    e.preventDefault();

    if (confirm('Are you sure?')) {
      $(this).closest('.wpcas_rule').remove();
    }
  });

  $(document).on('click touch', '.wpcas_expand_all', function(e) {
    e.preventDefault();

    $('.wpcas_rule').addClass('active');
  });

  $(document).on('click touch', '.wpcas_collapse_all', function(e) {
    e.preventDefault();

    $('.wpcas_rule').removeClass('active');
  });

  $(document).on('click touch', '.wpcas_conditional_remove', function(e) {
    e.preventDefault();

    if (confirm('Are you sure?')) {
      $(this).closest('.wpcas_conditional_item').remove();
    }
  });

  $(document).on('click touch', '.wpcas_import_export', function(e) {
    if (!$('#wpcas_import_export').length) {
      $('body').append('<div id=\'wpcas_import_export\'></div>');
    }

    $('#wpcas_import_export').html('Loading...');

    $('#wpcas_import_export').dialog({
      minWidth: 460,
      title: 'Import/Export',
      modal: true,
      dialogClass: 'wpc-dialog',
      open: function() {
        $('.ui-widget-overlay').bind('click', function() {
          $('#wpcas_import_export').dialog('close');
        });
      },
    });

    var data = {
      action: 'wpcas_import_export', nonce: wpcas_vars.wpcas_nonce,
    };

    $.post(ajaxurl, data, function(response) {
      $('#wpcas_import_export').html(response);
    });

    e.preventDefault();
  });

  $(document).on('click touch', '.wpcas_import_export_save', function(e) {
    if (confirm('Are you sure?')) {
      $(this).addClass('disabled');

      var rules = $('.wpcas_import_export_data').val();
      var data = {
        action: 'wpcas_import_export_save',
        nonce: wpcas_vars.wpcas_nonce,
        rules: rules,
      };

      $.post(ajaxurl, data, function(response) {
        location.reload();
      });
    }
  });

  $(document).on('click touch', '.wpcas_shortcodes_btn', function(e) {
    e.preventDefault();

    $('#wpcas_shortcodes_dialog').
        dialog({
          minWidth: 460,
          modal: true,
          dialogClass: 'wpc-dialog wpc-dialog-wide',
          open: function() {
            $('.ui-widget-overlay').bind('click', function() {
              $('#wpcas_shortcodes_dialog').dialog('close');
            });
          },
        });
  });

  function wpcas_terms_init() {
    $('.wpcas_terms').each(function() {
      var $this = $(this);
      var apply = $this.closest('.wpcas_rule').
          find('.wpcas_source_selector').
          val();

      $this.selectWoo({
        ajax: {
          url: ajaxurl, dataType: 'json', delay: 250, data: function(params) {
            return {
              q: params.term, action: 'wpcas_search_term', taxonomy: apply, nonce: wpcas_vars.wpcas_nonce,
            };
          }, processResults: function(data) {
            var options = [];
            if (data) {
              $.each(data, function(index, text) {
                options.push({id: text[0], text: text[1]});
              });
            }
            return {
              results: options,
            };
          }, cache: true,
        }, minimumInputLength: 1,
      });

      if (apply !== 'all' && apply !== 'products' && apply !== 'combined') {
        // for terms only
        if ($this.data(apply) !== undefined && $this.data(apply) !== '') {
          $this.val(String($this.data(apply)).split(',')).change();
        } else {
          $this.val([]).change();
        }
      }
    });
  }

  function wpcas_settings() {
    var animated = $('.wpcas_animated_placeholder').val();

    if (animated === 'yes') {
      $('.wpcas-show-if-animated-placeholder').show();
    } else {
      $('.wpcas-show-if-animated-placeholder').hide();
    }
  }

  function wpcas_combined_init() {
    $('.wpcas_combined_selector').each(function() {
      var $this = $(this);
      var $combined = $this.closest('.wpcas_combined');
      var val = $this.val();

      if (val === 'price') {
        $combined.find('.wpcas_combined_same_wrap').hide();
        $combined.find('.wpcas_combined_compare_wrap').hide();
        $combined.find('.wpcas_combined_val_wrap').hide();
        $combined.find('.wpcas_combined_number_compare_wrap').show();
        $combined.find('.wpcas_combined_number_val_wrap').show();
      } else {
        $combined.find('.wpcas_combined_same_wrap').hide();
        $combined.find('.wpcas_combined_number_compare_wrap').hide();
        $combined.find('.wpcas_combined_number_val_wrap').hide();
        $combined.find('.wpcas_combined_compare_wrap').show();
        $combined.find('.wpcas_combined_val_wrap').show();
      }
    });
  }

  function wpcas_condition_init() {
    $('.wpcas_condition_compare_selector').each(function() {
      var $this = $(this);
      var $condition = $this.closest('.wpcas_condition');
      var val = $this.find('option:selected').data('val');

      if (val === 'number') {
        $condition.find('.wpcas_condition_number').show();
        $condition.find('.wpcas_condition_text').hide();
        $condition.find('.wpcas_condition_regex').hide();
      } else if (val === 'regex') {
        $condition.find('.wpcas_condition_number').hide();
        $condition.find('.wpcas_condition_text').hide();
        $condition.find('.wpcas_condition_regex').show();
      } else {
        $condition.find('.wpcas_condition_number').hide();
        $condition.find('.wpcas_condition_text').show();
        $condition.find('.wpcas_condition_regex').hide();
      }
    });
  }

  function wpcas_condition_tags_init() {
    $('.wpcas_condition_text_val').selectWoo({
      tags: true,
      multiple: true,
    });
  }

  function wpcas_combined_terms_init() {
    $('.wpcas_apply_terms').each(function() {
      var $this = $(this);
      var taxonomy = $this.closest('.wpcas_combined').
          find('.wpcas_combined_selector').
          val();

      $this.selectWoo({
        ajax: {
          url: ajaxurl, dataType: 'json', delay: 250, data: function(params) {
            return {
              q: params.term, action: 'wpcas_search_term', taxonomy: taxonomy, nonce: wpcas_vars.wpcas_nonce,
            };
          }, processResults: function(data) {
            var options = [];
            if (data) {
              $.each(data, function(index, text) {
                options.push({id: text[0], text: text[1]});
              });
            }
            return {
              results: options,
            };
          }, cache: true,
        }, minimumInputLength: 1,
      });
    });
  }

  function wpcas_returned_init($rule) {
    if (typeof $rule !== 'undefined') {
      var returned = $rule.find('.wpcas_returned_selector').
          find(':selected').
          val();

      $rule.find('.hide_returned').hide();
      $rule.find('.show_if_returned_' + returned).show();
    } else {
      $('.wpcas_returned_selector').each(function(e) {
        var $rule = $(this).closest('.wpcas_rule');
        var returned = $(this).find(':selected').val();

        $rule.find('.hide_returned').hide();
        $rule.find('.show_if_returned_' + returned).show();
      });
    }
  }

  function wpcas_source_init($rule) {
    if (typeof $rule !== 'undefined') {
      var apply = $rule.find('.wpcas_source_selector').
          find(':selected').
          val();
      var text = $rule.find('.wpcas_source_selector').
          find(':selected').
          text();

      $rule.find('.wpcas_get_text').text(text);
      $rule.find('.hide_get').hide();
      $rule.find('.show_if_' + apply).show();
      $rule.find('.show_get').show();
      $rule.find('.hide_if_' + apply).hide();
    } else {
      $('.wpcas_source_selector').each(function(e) {
        var $rule = $(this).closest('.wpcas_rule');
        var apply = $(this).find(':selected').val();
        var text = $(this).find(':selected').text();

        $rule.find('.wpcas_get_text').text(text);
        $rule.find('.hide_get').hide();
        $rule.find('.show_if_' + apply).show();
        $rule.find('.show_get').show();
        $rule.find('.hide_if_' + apply).hide();
      });
    }
  }

  function wpcas_sortable() {
    $('.wpcas_rules').sortable({handle: '.wpcas_rule_move'});
  }

  function wpcas_enhanced_select() {
    $(document.body).trigger('wc-enhanced-select-init');
  }

  function wpcas_build_label($rule) {
    if (typeof $rule !== 'undefined') {
      var get = $rule.find('.wpcas_returned_selector').
          find('option:selected').
          text();

      $rule.find('.wpcas_rule_returned').
          html('Returned results: ' + get);
    } else {
      $('.wpcas_rule ').each(function() {
        var $this = $(this);
        var get = $this.find('.wpcas_returned_selector').
            find('option:selected').
            text();

        $this.find('.wpcas_rule_returned').
            html('Returned results: ' + get);
      });
    }
  }

  function wpcas_init_editor($rule) {
    var editor = $rule.find('.wpcas_editor');
    var editor_id = editor.attr('id');

    wp.editor.initialize(editor_id, {
      mediaButtons: true,
      tinymce: {
        wpautop: true,
        plugins: 'charmap colorpicker compat3x directionality fullscreen hr image lists media paste tabfocus textcolor wordpress wpautoresize wpdialogs wpeditimage wpemoji wpgallery wplink wptextpattern wpview',
        toolbar1: 'formatselect bold italic | bullist numlist | blockquote | alignleft aligncenter alignright | link unlink | wp_more | spellchecker',
      },
      quicktags: true,
    });
  }

  // Rule Summary Modal
  $(document).on('click touch', '.wpcas_rule_summary', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $item = $(this).closest('.wpcas_rule');
      var key = $item.data('key') || '';
      var ruleName = $item.find('.wpcas_rule_name').text() || ('#' + key);

      // Check conditions
      var conditions = [];
      $item.find('.wpcas_condition').each(function () {
          var $c = $(this);
          var compare = $c.find('.wpcas_condition_compare_selector option:selected').text().trim();
          var valType = $c.find('.wpcas_condition_compare_selector option:selected').data('val');
          var detail = '';

          if (valType === 'number') {
              detail = $c.find('.wpcas_condition_number input').val();
          } else if (valType === 'text') {
              var terms = [];
              $c.find('.wpcas_condition_text_val option:selected').each(function () {
                  terms.push($(this).text().trim());
              });
              if (terms.length) {
                  detail = terms.join(', ');
              }
          } else if (valType === 'regex') {
              detail = $c.find('.wpcas_condition_regex input').val();
          }

          if (compare) {
              conditions.push('<span class="wpcas-sum-type">' + compare + '</span>' + (detail ? ': <span class="wpcas-sum-value">' + detail + '</span>' : ''));
          }
      });

      // Returned results
      var returned = $item.find('.wpcas_returned_selector option:selected').text().trim();
      var returnedDetail = '';
      var returnedVal = $item.find('.wpcas_returned_selector').val();
      
      if (returnedVal === 'products') {
          var getVal = $item.find('.wpcas_source_selector').val();
          var getText = $item.find('.wpcas_source_selector option:selected').text().trim();
          returnedDetail = '<strong>Source:</strong> ' + getText;
          if (getVal === 'products') {
              var terms = [];
              $item.find('.wpcas-product-search option:selected').each(function() {
                  terms.push($(this).text().trim());
              });
              if (terms.length) {
                  returnedDetail += '<br/>(Products: ' + terms.join(', ') + ')';
              }
          } else if (getVal === 'combined') {
              var terms = [];
              $item.find('.wpcas_combined').each(function() {
                  var cSelectVal = $(this).find('.wpcas_combined_selector').val();
                  var cSelectText = $(this).find('.wpcas_combined_selector option:selected').text().trim();
                  
                  if (cSelectVal === 'price') {
                      var cmp = $(this).find('.wpcas_combined_number_compare option:selected').text().trim();
                      var num = $(this).find('.wpcas_combined_number_val').val();
                      terms.push('<strong>' + cSelectText + '</strong> ' + cmp + ' ' + num);
                  } else {
                      var cmp = $(this).find('.wpcas_combined_compare option:selected').text().trim();
                      var termArr = [];
                      $(this).find('.wpcas_combined_val option:selected').each(function() {
                          termArr.push($(this).text().trim());
                      });
                      if (termArr.length) {
                          terms.push('<strong>' + cSelectText + '</strong> ' + cmp + ' ' + termArr.join(', '));
                      }
                  }
              });
              if (terms.length) {
                  returnedDetail += '<br/><div style="margin-top: 4px; padding-left: 10px; border-left: 2px solid #e2e8f0;">' + terms.join('<br/>') + '</div>';
              }
          } else if (getVal !== 'all') {
              var terms = [];
              $item.find('.wpcas_terms option:selected').each(function() {
                  terms.push($(this).text().trim());
              });
              if (terms.length) {
                  returnedDetail += '<br/>(Terms: ' + terms.join(', ') + ')';
              }
          }
      } else if (returnedVal === 'message') {
          returnedDetail = '<strong>Custom message</strong>';
      }

      // Build HTML
      var html = '<div class="wpcas-sum-section">';
      html += '<div class="wpcas-sum-status active"><span class="wpcas-sum-dot"></span> Active</div>';
      if (key) {
          html += '<div class="wpcas-sum-badge">#' + key + '</div>';
      }
      html += '</div>';

      html += '<div class="wpcas-sum-section">';
      html += '<div class="wpcas-sum-label">Conditions</div>';
      if (conditions.length > 0) {
          html += '<div class="wpcas-sum-conditions">';
          for (var j = 0; j < conditions.length; j++) {
              var cPrefix = j > 0 ? '<span class="wpcas-sum-relation">AND</span> ' : '';
              html += '<div class="wpcas-sum-condition-item">' + cPrefix + conditions[j] + '</div>';
          }
          html += '</div>';
      } else {
          html += '<div class="wpcas-sum-detail">Include either keyword</div>';
      }
      html += '</div>';

      html += '<div class="wpcas-sum-section">';
      html += '<div class="wpcas-sum-label">Returned Results</div>';
      html += '<div class="wpcas-sum-detail">';
      html += '<strong class="wpcas-sum-type">' + returned + '</strong>';
      if (returnedDetail) {
          html += '<div style="margin-top: 6px;">' + returnedDetail + '</div>';
      }
      html += '</div></div>';

      if ($('#wpcas-summary-modal').length === 0) {
          $('body').append('<div id="wpcas-summary-modal"><div class="wpcas-summary-content"></div></div>');
      }

      $('#wpcas-summary-modal').attr('title', ruleName).find('.wpcas-summary-content').html(html);
      $('#wpcas-summary-modal').dialog({
          modal: true,
          width: 520,
          dialogClass: 'wpc-dialog wpcas-dialog wpcas-summary-dialog',
          open: function () {
              $(this).dialog('widget').siblings('.ui-widget-overlay').addClass('wpcas-overlay');
              $(document).on('click.wpcas-summary', '.wpcas-overlay', function () {
                  $('#wpcas-summary-modal').dialog('close');
              });
          },
          close: function () {
              $(document).off('click.wpcas-summary');
              $('.wpcas-overlay').removeClass('wpcas-overlay');
          },
          buttons: {
              'Close': function () {
                  $(this).dialog('close');
              }
          }
      });
  });
// ──── Simulator ────────────────────────────────────
    
    $(document).on('click', '#wpcas-sim-run', function (e) {
        e.preventDefault();
        var $btn = $(this);
        var $spinner = $('#wpcas-sim-spinner');
        var $results = $('#wpcas-sim-results');
        var keyword = $('#wpcas-sim-keyword').val();
        var category = $('#wpcas-sim-category').val();

        if (!keyword) {
            alert('Please enter a keyword to simulate.');
            $('#wpcas-sim-keyword').focus();
            return;
        }

        $btn.prop('disabled', true);
        $spinner.addClass('is-active');
        $results.removeClass('wpcas_hide').html(
            '<div class="wpcas-sim-loading" style="padding: 15px; color: #64748b;"><span class="spinner is-active" style="float:none; margin:0 5px 0 0;"></span> Simulating search results...</div>'
        );

        $.post(ajaxurl, {
            action: 'wpcas_simulate',
            nonce: wpcas_vars.wpcas_nonce,
            keyword: keyword,
            category: category
        }, function (response) {
            $btn.prop('disabled', false);
            $spinner.removeClass('is-active');

            if (!response.success) {
                var errMsg = response.data && response.data.message ? response.data.message : 'Simulation failed.';
                $results.html('<div class="wpcas-sim-empty-state" style="padding: 15px; color: #ef4444;"><span class="dashicons dashicons-warning"></span> ' + errMsg + '</div>');
                return;
            }

            var data = response.data;
            var html = '';

            // 1. Show Matched Rule if any
            if (data.rule) {
                html += '<div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; color: #166534; display: flex; align-items: center; gap: 8px;">';
                html += '  <span class="dashicons dashicons-yes-alt" style="color: #22c55e;"></span>';
                html += '  <strong>Smart Search Rule Matched:</strong> ' + data.rule.name;
                if (data.rule.type === 'message') {
                    html += ' <span style="background: #dcfce7; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: auto;">Returns Message</span>';
                } else {
                    html += ' <span style="background: #dcfce7; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: auto;">Returns Products</span>';
                }
                html += '</div>';
            } else {
                html += '<div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; color: #64748b; display: flex; align-items: center; gap: 8px;">';
                html += '  <span class="dashicons dashicons-info"></span>';
                html += '  <strong>No rules matched.</strong> Fallback to standard product search.';
                html += '</div>';
            }

            // 2. Show Results HTML
            html += '<div class="wpcas-simulator-results-wrap" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">';
            html += '  <div style="background: #f1f5f9; padding: 10px 15px; font-weight: 500; border-bottom: 1px solid #e2e8f0;">Search Output Preview</div>';
            html += '  <div class="wpcas-result-items" style="position: relative; width: 100%;">' + data.results + '</div>';
            html += '</div>';

            $results.html(html);
        });
    });

    $(document).on('click', '#wpcas-sim-reset', function (e) {
        e.preventDefault();
        $('#wpcas-sim-keyword').val('');
        $('#wpcas-sim-category').val('0');
        $('#wpcas-sim-results').addClass('wpcas_hide').empty();
    });

})(jQuery);

    