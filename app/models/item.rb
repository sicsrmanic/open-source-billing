#
# Open Source Billing - A super simple software to create & send invoices to your customers and
# collect payments.
# Copyright (C) 2013 Mark Mian <mark.mian@opensourcebilling.org>
#
# This file is part of Open Source Billing.
#
# Open Source Billing is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Open Source Billing is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Open Source Billing.  If not, see <http://www.gnu.org/licenses/>.
#
class Item < ActiveRecord::Base
  # default scop
  #default_scope order("#{self.table_name}.created_at DESC")

  # attr
  attr_accessible :inventory, :item_description, :item_name, :quantity, :tax_1, :tax_2, :track_inventory, :unit_cost, :archive_number, :archived_at, :deleted_at

  # associations
  has_many :invoice_line_items, :dependent => :destroy
  belongs_to :tax1, :foreign_key => "tax_1", :class_name => "Tax"
  belongs_to :tax2, :foreign_key => "tax_2", :class_name => "Tax"
  belongs_to :company
  has_many :company_entities, :as => :entity

  # archive and delete
  acts_as_archival
  acts_as_paranoid

  paginates_per 10

  def self.multiple_items ids
    ids = ids.split(",") if ids and ids.class == String
    where("id IN(?)", ids)
  end

  def self.is_exists? item_name
    where(:item_name => item_name).present?
  end

  def self.archive_multiple ids
    self.multiple_items(ids).each { |item| item.archive }
  end

  def self.delete_multiple ids
    self.multiple_items(ids).each { |item| item.destroy }
  end

  def self.recover_archived ids
    self.multiple_items(ids).each { |item| item.unarchive }
  end

  def self.recover_deleted ids
    ids = ids.split(",") if ids and ids.class == String
    where("id IN(?)", ids).only_deleted.each do |item|
      item.recover
      item.unarchive
    end
  end

  def self.filter(params, per_page)
    #case params[:status]
    #  when "active" then
    #    self.unarchived.page(params[:page]).per(per_page)
    #  when "archived" then
    #    self.archived.page(params[:page]).per(per_page)
    #  when "deleted" then
    #    self.only_deleted.page(params[:page]).per(per_page)
    #end
    mappings = {active: 'unarchived', archived: 'archived', deleted: 'only_deleted'}
    method = mappings[params[:status].to_sym]
    self.send(method).page(params[:page]).per(per_page)
  end

  def self.get_items(params)
    account = params[:user].current_account

    # get the items associated with companies
    company_id = params['current_company'] || params[:user].current_company || params[:user].current_account.companies.first.id
    company_items = Company.find(company_id).items.send(params[:status])
    # get the unique items associated with companies and accounts
    items = (account.items.send(params[:status]) + company_items).uniq

    # sort items in ascending or descending order
    items.sort! do |a, b|
      b, a = a, b if params[:sort_direction] == 'desc'

      if %w(tax1.name tax2.name).include?(params[:sort_column])
        item1 = a.send(params[:sort_column].split('.')[0]).send(params[:sort_column].split('.')[1]) rescue ''
        item2 = b.send(params[:sort_column].split('.')[0]).send(params[:sort_column].split('.')[1]) rescue ''

        #TODO change the above logic to eval
        #item1 = eval("a.#{params[:sort_column]}") rescue ''
        #item2 = eval("b.#{params[:sort_column]}") rescue ''
        item1 <=> item2
      else
        a.send(params[:sort_column]) <=> b.send(params[:sort_column])
      end
    end if params[:sort_column] && params[:sort_direction]

    Kaminari.paginate_array(items).page(params[:page]).per(params[:per])

  end
end